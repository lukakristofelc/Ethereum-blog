import React, { Component } from 'react';
import './MyProfileComponent.css';
import Blog from '../../utils/Blog.json'
import { ethers } from 'ethers';
import { ObjavaComponent } from '../ObjavaComponent/ObjavaComponent';
import { FriendRequest } from '../FriendRequestComponent/FriendRequestComponent';

export class MyProfile extends React.Component {

    constructor(props) {
        super(props);
        this.currentUser = props.currentUser;
        this.contract = props.contract;

        this.getPosts = this.getPosts.bind(this);
        this.hasCorrectAddress = this.hasCorrectAddress.bind(this);
        this.addFriend = this.addFriend.bind(this);

        this.state = {
            posts: [],
            messageContent: '',
            username: '',
            friendRequests: [],
            friends: []
        }
    }

    async getPosts() {    
        try {    
            const user = await this.contract.getUser(this.currentUser);
            this.setState({posts: orderPosts(user['posts']), username: user['name']});
        } catch(e) {
          console.log(e);
        }
    }

    async getFriends() {
        try {
            const user = await this.contract.getUser(this.currentUser);
            this.setState({friends: user['friends']});
        } catch (error) {
            console.log(error);            
        }
    }

    hasCorrectAddress(post) {        
        return post['pubkey'] === this.foreignAddress;
    }

    async getFriendRequests() {
        try {
            const friendRequests = await this.contract.getFriendRequests();
            this.setState({friendRequests: friendRequests});
        } catch (e) {
            console.log(e);
        }
    } 

    async addFriend() {
        try {
            await this.contract.addFriend(this.foreignAddress, this.username);
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        this.getPosts();
        this.getFriendRequests();
        this.getFriends();
        return (
            <div className='profile'>
                <div className='profile-info'>
                    <div className='user-info'>
                        <h2>{this.state.username}</h2>
                        <h2>{this.currentUser}</h2>
                    </div>
                    <div className='friend-requests'>
                        <h2>FRIEND REQUESTS</h2>
                        { this.state.friendRequests.length > 0 ?
                            this.state.friendRequests.map(friendRequest => 
                                <FriendRequest  key={friendRequest['pubkey']}
                                                contract={this.contract} 
                                                name={friendRequest['name']} 
                                                address={friendRequest['pubkey']}
                                />) : <p id='no-friends'>You don't have any friend requests at this moment.</p>
                        }
                    </div>
                    <div className='friend-requests'>
                        <h2>FRIENDS</h2>
                        { this.state.friends.length > 0 ?
                            this.state.friends.map(friend => 
                                <button key={friend['pubkey']}>{friend['name']}</button>
                            ) : <p id='no-friends'>You don't have any friends.</p>
                        }
                    </div>      
                </div>
                {this.state.posts.length === 0 ?
                    <div className='no-posts'> 
                        <h2 id='posts-title'>POSTS</h2> 
                        <p>You have no posts to display.</p> 
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
