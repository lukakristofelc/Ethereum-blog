import React, { Component } from 'react';
import './FriendRequestComponent.css';

export class FriendRequest extends React.Component {

    constructor(props) {
        super(props);
        this.contract = props.contract;
        this.name = props.name;
        this.address = props.address;

        this.acceptRequest = this.acceptRequest.bind(this);
        this.declineRequest = this.declineRequest.bind(this);
    }

    goToProfile() {

    }

    async acceptRequest() {
        try {
            await this.contract.handleFriendRequest(this.address, true);
        } catch(e) {
          console.log(e);
        }
    }

    async declineRequest() {
        try {    
            await this.contract.handleFriendRequest(this.address, false);
        } catch(e) {
          console.log(e);
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.goToProfile}>{this.name}</button>
                <button onClick={this.acceptRequest}>ACCEPT</button>
                <button onClick={this.declineRequest}>DECILNE</button>
            </div>)
    }
}

const orderPosts = (accounts) => {
    return accounts.slice().sort((a, b) => b['timestamp'] - a['timestamp']);
}
