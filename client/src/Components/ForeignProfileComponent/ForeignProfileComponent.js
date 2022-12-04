import React, { Component } from 'react';
import './ForeignProfileComponent.css';
import Blog from '../../utils/Blog.json'
import { ethers } from 'ethers';
import { ObjavaComponent } from '../ObjavaComponent/ObjavaComponent';

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

        this.state = {
            posts: [],
            messageContent: ''
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

    render() {
        this.getPosts();
        return (
            <div>
                <h2>{this.username}</h2>
                <h2>{this.foreignAddress}</h2> <br/>
                <button onClick={(this.sendFriendRequest)}>SEND FRIEND REQUEST</button>
                <button onClick={this.props.setFeedView}>BACK</button> <br/>
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
                                                isMod={this.isMod}
                            />)
                }
            </div>)
    }
}

const orderPosts = (accounts) => {
    return accounts.slice().sort((a, b) => b['timestamp'] - a['timestamp']);
}
