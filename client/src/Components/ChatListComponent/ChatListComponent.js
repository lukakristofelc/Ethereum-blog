import React from 'react';
import './ChatListComponent.css';
import Blog from '../../utils/Blog.json'
import { ethers } from 'ethers';
import { ChatComponent } from '../ChatComponent/ChatComponent';

export class ChatListComponent extends React.Component {
    
    constructor(props) {
        super(props);
        this.currentUser = props.currentUser;
        this.contract = props.contract;
        this.getFriends = this.getFriends.bind(this);
        this.setCurrentChatAddress = this.setCurrentChatAddress.bind(this);
        this.closeChat = this.closeChat.bind(this);
        
        this.state = {
            friends: [],
            currentChatAddress: ""
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

    async setCurrentChatAddress(address) {
        this.setState({currentChatAddress: address});
    }

    closeChat() {
        this.setState({currentChatAddress: ""});
    }

    render() {
        this.getFriends();
        if (this.state.friends.length == 0)
        {
            return(
                <div className='chat-selection'>
                    <div className='chat-list'>
                        <h2>You need friends in order to message them.</h2>
                    </div>
                </div>
            );
        }
        else
        {
            return(
            <div className='chat-selection'>
                <div className='chat-list'>
                    <h2>SELECT A FRIEND</h2>
                    {this.state.friends.map(friend => <button key={friend['pubkey']} onClick={() => this.setCurrentChatAddress(friend['pubkey'])}>{friend['name']}</button>)}
                </div>
                {this.state.currentChatAddress != "" ? 
                    <ChatComponent 
                        key={this.state.currentChatAddress} 
                        contract={this.contract} 
                        currentChatAddress={this.state.currentChatAddress}
                        closeChat={this.closeChat}
                    /> : <div />}
            </div>
            )
        }
        
    }
}