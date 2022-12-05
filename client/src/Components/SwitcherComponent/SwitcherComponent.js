import React, { Component } from 'react';
import './SwitcherComponent.css';
import Blog from '../../utils/Blog.json'
import { ethers } from 'ethers';
import { Feed } from '../FeedComponent/FeedComponent';
import { ChatListComponent } from '../ChatListComponent/ChatListComponent';
import { MyProfile } from '../MyProfileComponent/MyProfileComponent';
import { ForeignProfile } from '../ForeignProfileComponent/ForeignProfileComponent';

export class SwitcherComponent extends React.Component {
    
    constructor(props) {
        super(props);
        this.currentUser = props.currentUser;
        this.isMod = props.isMod;
        this.contract = props.contract;

        this.setFeedView = this.setFeedView.bind(this);
        this.setMessageView = this.setMessageView.bind(this);
        this.setMyProfileView = this.setMyProfileView.bind(this);
        this.setForeignProfileView = this.setForeignProfileView.bind(this);

        this.state = {
            view:'F',
            profileData: {
                foreignAddress:'',
                username:'',
                numOfFriendRequests: 0
            }
        }
    }

    setFeedView() {
        this.setState({view:'F'});
    }

    setMessageView() {
        this.setState({view:'M'});
    }

    setMyProfileView() {
        this.setState({view:'P'});
    }

    setForeignProfileView(foreignAddress, username) {
        if (foreignAddress.toLowerCase() === this.currentUser.toLowerCase())
        {
            this.setMyProfileView();
            return;
        }

        const profileData = {
            foreignAddress: foreignAddress,
            username: username
        }

        this.setState({ view:'FP',
                        profileData: profileData});
    }

    async getFriendRequests() {
        try {
            const friendRequests = await this.contract.getFriendRequests(this.currentUser);
            this.setState({numOfFriendRequests: friendRequests.length});
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        this.getFriendRequests();
        return (
            <div>
                <div className='header'>
                    <h1>ETHEREUM BLOGCHAIN</h1>
                    <div className="buttons">
                        <button onClick={this.setFeedView}>FEED</button>
                        <button onClick={this.setMessageView}>MESSAGES</button>
                        <button onClick={this.setMyProfileView}>MY PROFILE {this.state.numOfFriendRequests > 0 ? <span> | {this.state.numOfFriendRequests}</span> : <span/>} </button>
                    </div>
                </div>
                {   this.state.view === 'F' ? <Feed currentUser={this.currentUser} contract={this.contract} setMessageView={this.setMessageView} setMyProfileView={this.setMyProfileView} setForeignProfileView={this.setForeignProfileView} isMod={this.isMod}/> :
                    this.state.view === 'M' ? <ChatListComponent setForeignProfileView={this.setForeignProfileView} currentUser={this.currentUser} contract={this.contract}/> :
                    this.state.view === 'P' ? <MyProfile  currentUser={this.currentUser} contract={this.contract} setForeignProfileView={this.setForeignProfileView} /> : 
                    this.state.view === 'FP' ? <ForeignProfile key={this.state.profileData.foreignAddress} setForeignProfileView={this.setForeignProfileView} foreignAddress={this.state.profileData.foreignAddress} username={this.state.profileData.username} currentUser={this.currentUser} contract={this.contract} isMod={this.isMod} /> : <div/>
                }
            </div>
        )
    }
}