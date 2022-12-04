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
            friendRequests: []
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
        return (
            <div>
                <h2>{this.state.username}</h2>
                <h2>{this.currentUser}</h2> <br/>
                {
                    this.state.friendRequests.map(friendRequest => 
                        <FriendRequest  key={friendRequest['pubkey']}
                                        contract={this.contract} 
                                        name={friendRequest['name']} 
                                        address={friendRequest['pubkey']}
                        />)
                }
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
            </div>)
    }
}

const orderPosts = (accounts) => {
    return accounts.slice().sort((a, b) => b['timestamp'] - a['timestamp']);
}
