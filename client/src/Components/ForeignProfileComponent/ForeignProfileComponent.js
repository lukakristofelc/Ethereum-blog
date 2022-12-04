import React, { Component } from 'react';
import './ForeignProfileComponent.css';
import Blog from '../../utils/Blog.json'
import { ethers } from 'ethers';
import { ObjavaComponent } from '../ObjavaComponent/ObjavaComponent';
import { FriendRequest } from '../FriendRequestComponent/FriendRequestComponent';

export class ForeignProfile extends React.Component {

    constructor(props) {
        super(props);
        this.currentUser = props.currentUser;
        this.username = props.username;
        this.foreignAddress = props.foreignAddress;
        this.contract = props.contract;
        this.isMod = props.isMod;

        this.getPosts = this.getPosts.bind(this);
        this.hasCorrectAddress = this.hasCorrectAddress.bind(this);
        this.sendFriendRequest = this.sendFriendRequest.bind(this);
        this.removeFriend = this.removeFriend.bind(this);
        this.state = {
            posts: [],
            messageContent: '',
            isFriend: false,
            friends: [],
            requestSent: false,
            requestSentCurrentUser: false
        }
    }

    async removeFriend() {
        try {    
            const user = await this.contract.removeFriend(this.foreignAddress);
            this.setState({isFriend: false});
        } catch(e) {
            console.log(e);
        }
    }

    async getPosts() {    
        try {    
            const user = await this.contract.getUser(this.foreignAddress);
            this.setState({posts: orderPosts(user['posts'])});
        } catch(e) {
            console.log(e);
        }
    }

    hasCorrectAddress(post) {        
        return post['pubkey'] === this.foreignAddress;
    }

    async sendFriendRequest() {
        try {
            await this.contract.sendFriendRequest(this.foreignAddress);
        } catch (e) {
            console.log(e);
        }
    }

    async requestSent() {
        try {
            const requests = await this.contract.getFriendRequests(this.foreignAddress);
            const requestSent = requests.filter(request => request['pubkey'].toLowerCase() === this.currentUser.toLowerCase()).length === 1;

            const requestsCurrentUser = await this.contract.getFriendRequests(this.currentUser);
            const requestSentCurrentUser = requestsCurrentUser.filter(request => request['pubkey'].toLowerCase() === this.foreignAddress.toLowerCase()).length === 1;
            console.log(requestSentCurrentUser)
            this.setState({
                requestSent: requestSent,
                requestSentCurrentUser: requestSentCurrentUser
            })
        } catch (e) {
            console.log(e);
        }
    }

    async getFriends() {
        try {
            const user = await this.contract.getUser(this.foreignAddress);
            this.setState({friends: user['friends']});
        } catch (error) {
            console.log(error);            
        }
    }

    async isFriend() {
        try {
            const user = await this.contract.getUser(this.foreignAddress);
            const isFriend = user['friends'].filter(friend => friend['pubkey'].toLowerCase() === this.currentUser.toLowerCase()).length === 1;
            this.setState({isFriend: isFriend});
        } catch (error) {
            console.log(error);            
        }
    }

    render() {
        this.getPosts();
        this.isFriend();
        this.getFriends();
        this.requestSent();
        return (
            <div className='profile'>
                <div className='profile-info'>
                    <div className='user-info'>
                        <h2>{this.username}</h2>
                        <h2>{this.foreignAddress}</h2>
                        {
                            this.state.isFriend ? <button onClick={this.removeFriend}>REMOVE FRIEND</button> : <div />
                        }
                    </div>
                    {this.state.isFriend ?
                        <div className='friend-requests'>
                            <h2>FRIENDS</h2>
                            { this.state.friends.length > 0 ?
                                this.state.friends.map(friend => 
                                    <button onClick={() => this.props.setForeignProfileView(friend['pubkey'], friend['name'])} key={friend['pubkey']}>{friend['name']}</button>
                                ) : <p id='no-friends'>You don't have any friends.</p>
                            }
                        </div> : 
                        <div className='friend-requests'>
                            {
                                this.state.requestSentCurrentUser ?
                                <div>
                                    <h2>You have a pending friend request from {this.username}</h2>
                                    <FriendRequest  foreignProfile={true} 
                                                    contract={this.contract} 
                                                    name={this.username} 
                                                    address={this.foreignAddress}
                                    />
                                </div> : !this.state.requestSent ?
                                <div>
                                    <h2>You need to be friends with {this.username} to see their friends.</h2>
                                    <button onClick={(this.sendFriendRequest)}>SEND FRIEND REQUEST</button>
                                </div> : 
                                <div>
                                    <h2>Friend request has been sent.</h2>
                                </div> 
                            } 
                        </div>
                    } 
                </div>
                {this.state.posts.length === 0 ?
                    <div className='no-posts'> 
                        <h2 id='posts-title'>POSTS</h2> 
                        <p>{this.username} has no posts to display.</p> 
                    </div> : 
                    <div className='posts'>
                        <h2>POSTS</h2>
                        {
                        this.state.posts.map(objava =>
                            <ObjavaComponent    key={objava['id']}
                                                id={objava['id']}
                                                authorKey={objava['pubkey']}
                                                author={objava['author']} 
                                                content={objava['content']} 
                                                timestamp={new Date(objava['timestamp'] * 1000).toLocaleString()}
                                                currentUser={this.currentUser}
                                                isProfile={true}
                            />)
                        }
                    </div>
                }
            </div>)
    }
}

const orderPosts = (accounts) => {
    return accounts.slice().sort((a, b) => b['timestamp'] - a['timestamp']);
}
