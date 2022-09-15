import './App.css';
import { useState, useEffect } from "react"
import { ObjavaComponent } from './Components/ObjavaComponent/ObjavaComponent'
import { ethers } from 'ethers';
import Blog from './utils/Blog.json'

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [dataList, setDataList] = useState([]);
  const [input, setInput] = useState('');
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

  function connectContract() {
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

  async function getPosts() {    
    try {
      const BlogContract = connectContract();

      let objaveList = await BlogContract.vseObjave();
      setDataList(orderPosts(objaveList));

    } catch(e) {
      console.log(e);
    }
  }

  async function updatePosts() {
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

  useEffect(() => {
    getPosts();
  });

  return (
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
            (
              <div className='nova-objava'>
                <h1 style={{textAlign: 'center'}}>ETHEREUM BLOGCHAIN</h1>
                <textarea 
                  type="text"
                  placeholder="Vnesi novo objavo"
                  onChange={e => setInput(e.target.value)}
                  value={input}
                  rows="8" cols="50"
                />
                <br/>
                <button onClick={updatePosts}>OBJAVI</button>
              </div>
            )
          }
          {
            dataList.map(objava => 
            <ObjavaComponent avtor={objava['avtor']} 
                    vsebina={objava[1]} 
                    timestamp={new Date(objava['timestamp'] * 1000).toLocaleString()} />)
          }
        </div>
      )}
    </div>
  );
}

export default App;
