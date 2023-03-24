import {useEffect, useState} from 'react';
import './FeedComponent.css';
import { ObjavaComponent } from '../ObjavaComponent/ObjavaComponent';
import { ForeignProfile } from '../ForeignProfileComponent/ForeignProfileComponent';

export default function Feed() 
{
        let currentUser = props.currentUser;
        let contract = props.contract;
        let isMod = props.isMod;

        const [posts, setPosts] = useState([]);
        const [view, setView] = useState('');
        const [username, setUsername] = useState('');
        const [foreignAddress, setForeignAddress] = useState('');
        const [input, setInput] = useState('');

    const getPosts = async() => {    
        try {
          let postList = await contract.getPosts();
          setrPosts(orderPosts(postList));
        } catch(e) {
          console.log(e);
        }
    }

    const addPost = async() => {
        try {
            if (input == "")
            {
                alert("Your post cannot be empty.");
                return;
            }
            await contract.addPost(input);
            setInput('');
        } catch(error) {
            console.log(error);
        }
    }  

    const setProfileView = () => {
        setView('FP');
    }

    const setFeedView = () => {
        setView('F');
    }

    if (view === 'F')
    {
        getPosts();
        return(  
            <div>
                <textarea 
                    type="text"
                    placeholder="Insert new post"
                    onChange={e => setInput(e.target.value)}
                    value={input}
                    rows="8" cols="50"
                />
                <br/>
                <button onClick={addPost}>POST</button> <br/>
                {
                this.state.posts.map(objava =>
                    <ObjavaComponent    key={objava['id']}
                                        id={objava['id']}
                                        author={objava['author']}
                                        authorKey={objava['pubkey']}
                                        content={objava['content']} 
                                        timestamp={new Date(objava['timestamp'] * 1000).toLocaleString()}
                                        setProfileView={setProfileView}
                                        setFeedView={setFeedView}
                                        setForeignAddress={setForeignAddress}
                                        setUsername={setUsername}
                                        isMod={isMod}
                                        contract={contract}
                                        currentUser={currentUser}
                                        isProfile={false}
                    />)
                }
            </div>)
    }
    else
    {
        props.setForeignProfileView(foreignAddress, username);
    }
}


const orderPosts = (accounts) => {
    return accounts.slice().sort((a, b) => b['timestamp'] - a['timestamp']);
}