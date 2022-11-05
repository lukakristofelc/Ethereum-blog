import React, { Component } from 'react';
import './ObjavaComponent.css';
import Blog from '../../utils/Blog.json'
import { ethers } from 'ethers';
import { ForeignProfile } from '../ForeignProfileComponent/ForeignProfileComponent';
const blogContractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const connectContract = () => {
  const {ethereum} = window;

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

export class ObjavaComponent extends React.Component {

  constructor(props) {
    super(props);
    this.id = this.props.id;
    this.author = this.props.author;
    this.content = this.props.content;
    this.timestamp = this.props.timestamp;
    
    this.editPost = this.editPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async editPost() {
    let edit = prompt("Enter your edit:");
    try {
      const contract = connectContract();
      await contract.urediObjavo(edit, this.props.id);
    }
    catch(error) {
      console.log(error);
    }
  }

  async deletePost() {
    try {
      const contract = connectContract();
      await contract.izbrisiObjavo(this.props.id);
    }
    catch(error) {
      console.log(error);
    }
  }

  handleClick() {
    this.props.setProfileView();
    this.props.setForeignAddress(this.author);
  }

  render() {
    /*if (this.props.moderator)
    {
      return (
        <div className='objava'>
          <div className="objava-content">
            <button className='author' onClick={this.handleClick}>{this.author}</button>
            <div className='vsebina'>{this.content}</div>
            <div className='author'>{this.timestamp}</div>
            <button onClick={this.editPost}>EDIT</button>
            <button onClick={this.deletePost}>DELETE</button>
          </div>
        </div>
    )
    }
    else
    {*/
      return (
        <div className='objava'>
          <div className="objava-content">
            <button className='author' onClick={this.handleClick}>{this.author}</button>
            <div className='vsebina'>{this.content}</div>
            <div className='timestamp'>{this.timestamp}</div>
          </div>
        </div>
    )
    //}
  }
}