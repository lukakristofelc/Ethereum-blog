import React, { Component } from 'react';
import './SwitcherComponent.css';
import Blog from '../../utils/Blog.json'
import { ethers } from 'ethers';
import { Feed } from '../FeedComponent/FeedComponent';

export class SwitcherComponent extends React.Component {
    
    constructor(props) {
        super(props);
        this.currentUser = props.currentUser;
            
        this.contract = connectContract();

        this.setFeedView = this.setFeedView.bind(this);
        this.setMessageView = this.setMessageView.bind(this);
        this.setProfileView = this.setProfileView.bind(this);

        this.state = {
            view:'F',
            profileData: {
                address:'',
                posts:[]
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
                    <button onClick={this.setFeedView}>FEED</button>
                    <button onClick={this.setMessageView}>MESSAGES</button>
                    <button onClick={this.setProfileView}>MY PROFILE</button>
                    <Feed currrentUser={this.currentUser} contract={this.contract} />
                </div>
            )
        }
        else if (this.state.view == 'M') {
            return (
                <div>
                    <button onClick={this.setFeedView}>FEED</button>
                    <button onClick={this.setMessageView}>MESSAGES</button>
                    <button onClick={this.setProfileView}>MY PROFILE</button>
                    <h1>MESSAGES</h1>
                    {/*<Messages />*/}
                </div>
            )
        }
        else {
            return (
                <div>
                    <button onClick={this.setFeedView}>FEED</button>
                    <button onClick={this.setMessageView}>MESSAGES</button>
                    <button onClick={this.setProfileView}>MY PROFILE</button>
                    <h1>PROFILE</h1>
                    {/*<Profile />*/}
                </div>
            )
        }
    }
}

const connectContract = () => {
    const {ethereum} = window;
    const blogContractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  
    if (!ethereum) {
      console.log('Ethereum object does not exist');
      return;
    }
  
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const BlogContract = new ethers.Contract(
      blogContractAddress,
      Blog.abi,
      signer
    )
  
    return BlogContract;
}
