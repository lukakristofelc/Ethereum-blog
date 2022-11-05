import './App.css';
import { useState, useEffect } from "react"
import { ObjavaComponent } from './Components/ObjavaComponent/ObjavaComponent'
import { ethers } from 'ethers';
import Blog from './utils/Blog.json'
import { SwitcherComponent } from './Components/SwitcherComponent/SwitcherComponent';

/* ČRNA LISTA, BRISANJE OBJAV, FEED, CHAT, PROFIL - na profilu vse objave tega avtorja, možnost objave slik - ipfs?, 
če greš z miško čez vidiš še vse podatke o opisu slike itd.... */

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [dataList, setDataList] = useState([]);
  const [input, setInput] = useState('');
  const [currentView, setCurentView] = useState('');
  const [moderator, setModerator] = useState('');

  const blogContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  async function connectWallet() {
    try{
      const {ethereum} = window;

      if (!ethereum) {
        console.log('Ethereum object does not exist');
        return;
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      setCurrentAccount(accounts[0]);

    } catch (e) {
      console.log(e);
    }
  }

  function setFeed() {
    setCurentView('F');
  }

  function setMessages() {
    setCurentView('M');
  }

  function setProfile() {
    setCurentView('P');
  }

  /*function connectContract() {
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
  }*/

  /*async function getPosts() {    
    try {
      const BlogContract = connectContract();

      let objaveList = await BlogContract.getPosts();
      setDataList(orderPosts(objaveList));

    } catch(e) {
      console.log(e);
    }
  }*/

  /*async function updatePosts() {
    try {
      const BlogContract = connectContract();

      await BlogContract.dodajObjavo(input);
      setInput("");

      getPosts();

    } catch(error) {
      console.log(error);
    }
  }  

  const orderPosts = (accounts) => {
    return accounts.slice().sort((a, b) => b['timestamp'] - a['timestamp']);
  }

  async function becomeModerator() {
    console.log(dataList);
    try 
    {
      const BlogContract = connectContract();
      await BlogContract.setModerator(currentAccount);
      setModerator(currentAccount);
    } 
    catch(error) 
    {
      console.log(error);
    }
  }

  useEffect(() => {
    //getPosts();
  });*/
  
  if (currentAccount === '')
  {
    return (<div>
              <h1 style={{textAlign: 'center'}}>ETHEREUM BLOGCHAIN</h1>
              <p style={{textAlign: 'center'}}>Please connect the Metamask wallet to continue:</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop:'20px' }}>
                <button onClick={connectWallet}>Connect Wallet</button>
              </div>
            </div>)
  }
  else
  {
    return (<div>
      <SwitcherComponent currentUser={currentAccount}/>
    </div>)
  }

  /*return (
    <div>
    {currentAccount === '' ? (
      <div>
        <h1 style={{textAlign: 'center'}}>ETHEREUM BLOGCHAIN</h1>
        <p style={{textAlign: 'center'}}>Please connect the Metamask wallet to continue:</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop:'20px' }}>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
      </div>
      ) : (
        <div className='app'>
          {
            currentView === 'F' ?
            (
              <div className='nova-objava'>
                <h1 style={{textAlign: 'center'}}>ETHEREUM BLOGCHAIN</h1>
                <button onClick={setFeed}>F</button>
                <button onClick={setMessages}>M</button>
                <button onClick={setProfile}>P</button> <br/><br/>
                <textarea 
                  type="text"
                  placeholder="Vnesi novo objavo"
                  onChange={e => setInput(e.target.value)}
                  value={input}
                  rows="8" cols="50"
                />
                <br/>
                <button onClick={updatePosts}>OBJAVI</button>
                  <div>
                  {
                    dataList.map(objava =>
                    <ObjavaComponent id={objava['id']}
                      avtor={objava['author']} 
                      vsebina={objava['content']} 
                      timestamp={new Date(objava['timestamp'] * 1000).toLocaleString()} 
                      moderator={currentAccount === moderator}
                      />)
                  }
                  </div>
              </div>
            ) : currentView === 'M' ?
            (
              <div className='nova-objava'>
                <h1 style={{textAlign: 'center'}}>ETHEREUM BLOGCHAIN</h1>
                <button onClick={setFeed}>F</button>
                <button onClick={setMessages}>M</button>
                <button onClick={setProfile}>P</button> <br/><br/>
              </div>
            ) : 
            (
              <div className='nova-objava'>
                <h1 style={{textAlign: 'center'}}>ETHEREUM BLOGCHAIN</h1>
                <button onClick={setFeed}>F</button>
                <button onClick={setMessages}>M</button>
                <button onClick={setProfile}>P</button> <br/><br/>
                <p>Current user: {currentAccount}</p>
                <p>Current moderator: {moderator}</p>
                <button onClick={becomeModerator}>BECOME MODERATOR</button> <br/>
              </div>
            )
          }
          {
            
          }
        </div>
      )}
    </div>
  );*/
}

export default App;