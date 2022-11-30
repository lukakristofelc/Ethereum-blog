import React from 'react';
import './ChatComponent.css';
import Blog from '../../utils/Blog.json'
import { ethers } from 'ethers';

export class ChatComponent extends React.Component {
    
    constructor(props) {
        super(props);
        this.currrentUser = props.currrentUser;
        this.contract = props.contract;
        this.messages = props.messages;
        this.currentChatAddress= props.currentChatAddress;
        this.sendMessage = this.sendMessage.bind(this);
        this.getChat = this.getChat.bind(this);

        this.state = {
            chat: [],
            input: ""
        }
    }

    async sendMessage() {
        if(this.state.input == "") {
            alert("Cannot send empty message");
            return;
        }
        try {
            await this.contract.sendMessage(this.currentChatAddress, this.state.input);
            this.setState({input:''});  
        } catch (error) {
            console.log(error);
        }
    }

    async getChat(address) {
        try {
           const chat = await this.contract.getChat(address);
           this.setState({chat: chat});
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        if (this.currentChatAddress != undefined) {
            this.getChat(this.currentChatAddress);
        }
        return(
            <div>
                <div className="message-composer">
                    <div className="messages">
                        {this.state.chat.map(message => <p key={message[0]}><span id='sender_name'>{message[2]+": "}</span><br/>{message[4]}</p>)}
                    </div>
                    <textarea 
                            type="text"
                            id='message_input'
                            placeholder="Insert new message"
                            onChange={e => this.setState({input: e.target.value})}
                            value={this.state.input}
                            rows="8" cols="50"
                        />
                    <button id='message_send' onClick={this.sendMessage}>SEND</button>
                </div>
            </div>
        )
    }
}