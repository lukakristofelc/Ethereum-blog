import React from 'react';
import './FeedComponent.css';
import { ObjavaComponent } from '../ObjavaComponent/ObjavaComponent';
import { ForeignProfile } from '../ForeignProfileComponent/ForeignProfileComponent';

export class Feed extends React.Component {

    constructor(props) {
        super(props);
        this.currrentUser = props.currrentUser;
        this.contract = props.contract;

        this.getPosts = this.getPosts.bind(this);
        this.addPost = this.addPost.bind(this);
        this.setFeedView = this.setFeedView.bind(this);
        this.setProfileView = this.setProfileView.bind(this);
        this.setForeignAddress = this.setForeignAddress.bind(this);
        
        this.state = {
            posts: [],
            view: 'F',
            foreignAddress: '',
            input:''
        }
    }

    async getPosts() {    
        try {
          let objaveList = await this.contract.getPosts();
          this.setState({posts: orderPosts(objaveList)});
    
        } catch(e) {
          console.log(e);
        }
    }

    async addPost() {
        try {
          await this.contract.dodajObjavo(this.state.input);
          this.setState({input:''});   

        } catch(error) {
          console.log(error);
        }
    }  

    setProfileView() {
        this.setState({view: 'P'});
    }

    setFeedView() {
        this.setState({view: 'F'});
    }

    setForeignAddress(foreignAddress) {
        this.setState({foreignAddress: foreignAddress});
    }

    render() {
        if (this.state.view === 'F')
        {
            this.getPosts();
            return(  
                <div>
                    <h1>ETHEREUM BLOGCHAIN</h1>
                    <textarea 
                        type="text"
                        placeholder="Vnesi novo objavo"
                        onChange={e => this.setState({input: e.target.value})}
                        value={this.state.input}
                        rows="8" cols="50"
                    />
                    <br/>
                    <button onClick={this.addPost}>OBJAVI</button> <br/>
                    {
                    this.state.posts.map(objava =>
                        <ObjavaComponent    key={objava['id']}
                                            id={objava['id']}
                                            author={objava['author']} 
                                            content={objava['content']} 
                                            timestamp={new Date(objava['timestamp'] * 1000).toLocaleString()}
                                            setProfileView={this.setProfileView}
                                            setFeedView={this.setFeedView}
                                            setForeignAddress={this.setForeignAddress}
                        />)
                    }
                </div>)
        }
        else
        {
            return(  
                <div>
                    <ForeignProfile currrentUser={this.currrentUser}
                                    foreignAddress={this.state.foreignAddress} 
                                    contract={this.contract} 
                                    setFeedView={this.setFeedView}
                    />
                </div>)
        }
        
      }
}


const orderPosts = (accounts) => {
    return accounts.slice().sort((a, b) => b['timestamp'] - a['timestamp']);
  }