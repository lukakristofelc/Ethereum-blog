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

  async function connectWallet() {
    try{
      const {ethereum} = window;

      if (!ethereum) {
        console.log('Ethereum object does not exist');
        return;
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      const contract = connectContract();

      if (!await contract.doesUserExist(accounts[0]))
      {
        try {
          await contract.createNewUser(prompt("Please select a username"));
          setCurrentAccount(accounts[0]);
        } catch (error) {
          console.log(error);
        }
      }
      else
      {
        setCurrentAccount(accounts[0]);
      }
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
}

export default App;