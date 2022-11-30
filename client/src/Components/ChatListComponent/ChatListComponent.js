import React from 'react';
import './ChatListComponent.css';
import Blog from '../../utils/Blog.json'
import { ethers } from 'ethers';
import { ChatComponent } from '../ChatComponent/ChatComponent';

export class ChatListComponent extends React.Component {
    
    constructor(props) {
        super(props);
        this.currrentUser = props.currrentUser;
        this.contract = props.contract;
        this.getFriends = this.getFriends.bind(this);
        this.setCurrentChatAddress = this.setCurrentChatAddress.bind(this);

        this.state = {
            friends: [],
            currentChatAddress: ""
        }
    }

    async getFriends() {
        try {
            const friendList = await this.contract.getMyFriends();
            this.setState({friends: friendList});
        } catch (error) {
            console.log(error);            
        }
    }

    async setCurrentChatAddress(address) {
        this.setState({currentChatAddress: address});
    }

    render() {
        this.getFriends();
        console.log(this.state.currentChatAddress);
        return(
            <div>
                <h2>SELECT A FRIEND YOU WOULD LIKE TO MESSAGE:</h2>
                {this.state.friends.map(friend => <button key={friend['pubkey']} onClick={() => this.setCurrentChatAddress(friend['pubkey'])}>{friend['name']}</button>)}
                {this.state.currentChatAddress != "" ? <ChatComponent contract={this.contract} currentChatAddress={this.state.currentChatAddress} /> : <div />}
            </div>
        )
    }
}