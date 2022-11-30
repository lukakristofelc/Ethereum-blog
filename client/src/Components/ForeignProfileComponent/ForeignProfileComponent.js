import React, { Component } from 'react';
import './ForeignProfileComponent.css';
import Blog from '../../utils/Blog.json'
import { ethers } from 'ethers';
import { ObjavaComponent } from '../ObjavaComponent/ObjavaComponent';

export class ForeignProfile extends React.Component {

    constructor(props) {
        super(props);
        this.currrentUser = props.currrentUser;
        this.username = props.username;
        this.foreignAddress = props.foreignAddress;
        this.contract = props.contract;

        this.getPosts = this.getPosts.bind(this);
        this.hasCorrectAddress = this.hasCorrectAddress.bind(this);
        this.addFriend = this.addFriend.bind(this);

        this.state = {
            posts: [],
            messageContent: ''
        }
    }

    async getPosts() {    
        try {    
          let objaveList = await this.contract.getPosts();
          this.setState({posts: orderPosts(objaveList).filter(this.hasCorrectAddress)});
        } catch(e) {
          console.log(e);
        }
    }

    hasCorrectAddress(post) {        
        return post['pubkey'] === this.foreignAddress;
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
        return (
            <div>
                <h2>Address: {this.foreignAddress}</h2>
                <h2>Username: {this.username}</h2> <br/>
                <button onClick={(this.addFriend)}>ADD FRIEND</button>
                <button onClick={this.props.setFeedView}>BACK</button> <br/>
                {
                    this.state.posts.map(objava =>
                            <ObjavaComponent    key={objava['id']}
                                                id={objava['id']}
                                                author={objava['author']} 
                                                content={objava['content']} 
                                                timestamp={new Date(objava['timestamp'] * 1000).toLocaleString()}
                            />)
                }
            </div>)
    }
}

const orderPosts = (accounts) => {
    return accounts.slice().sort((a, b) => b['timestamp'] - a['timestamp']);
}
