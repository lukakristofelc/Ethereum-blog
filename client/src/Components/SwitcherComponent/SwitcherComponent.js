import React, { Component } from 'react';
import './SwitcherComponent.css';
import Blog from '../../utils/Blog.json'
import { ethers } from 'ethers';
import { Feed } from '../FeedComponent/FeedComponent';
import { ChatListComponent } from '../ChatListComponent/ChatListComponent';
import { MyProfile } from '../MyProfileComponent/MyProfileComponent';

export class SwitcherComponent extends React.Component {
    
    constructor(props) {
        super(props);
        this.currentUser = props.currentUser;
        this.isMod = props.isMod;
        this.contract = props.contract;

        this.setFeedView = this.setFeedView.bind(this);
        this.setMessageView = this.setMessageView.bind(this);
        this.setProfileView = this.setProfileView.bind(this);

        this.state = {
            view:'F',
            profileData: {
                address:'',
                posts:[],
            }
        }
    }

    setFeedView() {
        this.setState({view:'F'});
    }

    setMessageView() {
        this.setState({view:'M'});
    }

    setProfileView() {
        this.setState({view:'P'});
    }

    render() {
        if (this.state.view == 'F') {
            return (
                <div>
                    <h1>ETHEREUM BLOGCHAIN</h1>
                    <button onClick={this.setFeedView}>FEED</button>
                    <button onClick={this.setMessageView}>MESSAGES</button>
                    <button onClick={this.setProfileView}>MY PROFILE</button>
                    <Feed currentUser={this.currentUser} contract={this.contract} setMessageView={this.setMessageView} isMod={this.isMod}/>
                </div>
            )
        }
        else if (this.state.view == 'M') {
            return (
                <div>
                    <h1>ETHEREUM BLOGCHAIN</h1>
                    <button onClick={this.setFeedView}>FEED</button>
                    <button onClick={this.setMessageView}>MESSAGES</button>
                    <button onClick={this.setProfileView}>MY PROFILE</button>
                    <ChatListComponent currentUser={this.currentUser} contract={this.contract}/>
                </div>
            )
        }
        else {
            return (
                <div>
                    <h1>ETHEREUM BLOGCHAIN</h1>
                    <button onClick={this.setFeedView}>FEED</button>
                    <button onClick={this.setMessageView}>MESSAGES</button>
                    <button onClick={this.setProfileView}>MY PROFILE</button>
                    <MyProfile  currentUser={this.currentUser}
                                contract={this.contract} />
                </div>
            )
        }
    }
}