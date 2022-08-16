import './App.css';
import {useState, useEffect} from "react"
import { ObjavaComponent } from './Components/ObjavaComponent/ObjavaComponent'
import { ObjavaContractAddress } from './config';
import {ethers} from 'ethers';
import Objava from './utils/Objava.json'

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState('');
  const [dataList, setDataList] = useState([]);
  const [input, setInput] = useState('');

  async function updatePosts() {
    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ObjavaContract = new ethers.Contract(
          ObjavaContractAddress,
          Objava.abi,
          signer
        )

        let novaObjava = await ObjavaContract.dodajObjavo(input);
        let objaveList = await ObjavaContract.vseObjave();
        
        setDataList(objaveList);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch(error) {
      console.log(error);
    }
  }

  async function connectWallet() {
    try{
      const {ethereum} = window

      if(!ethereum) {
        console.log('Metamask not detected');
        return;
      }

      let chainId = await ethereum.request({method: 'eth_chainId'});

      if(chainId != '0x4')
      {
        alert("You are not on Rinkeby Testnet!");
        setCorrectNetwork(false);
        return;
      }
      else
      {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'});

      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.log(e);
    }
  }

  const orderPosts = (accounts) => {
    return accounts.slice().sort((a, b) => b['timestamp'] - a['timestamp']);
  }

  async function initialize() {    
    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ObjavaContract = new ethers.Contract(
          ObjavaContractAddress,
          Objava.abi,
          signer
        )

        let objaveList = await ObjavaContract.vseObjave();
        setDataList(orderPosts(objaveList));
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    connectWallet();
    initialize();
  });

  return (
    <div>
    {currentAccount === '' ? (
      <div>
        <h1 style={{textAlign: 'center'}}>ETHEREUM BLOG</h1>
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      </div>
      ) : correctNetwork ? (
        <div className='app'>
          {
            (
              <div className='nova-objava'>
                <h1 style={{textAlign: 'center'}}>ETHEREUM BLOG</h1>
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
                    vsebina={objava[2]} 
                    timestamp={new Date(objava['timestamp'] * 1000).toLocaleString()} />)
          }
        </div>
      ) : (
        <div>
          <h1 style={{textAlign: 'center'}}>ETHEREUM BLOG</h1>
          <p>Please connect your Rinkeby Testnet Wallet and reload the page.</p>
        </div>
    )}
    </div>
  );
}

export default App;
