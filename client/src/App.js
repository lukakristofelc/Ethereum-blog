import './App.css';
import {useState, useEffect} from "react"
import { ObjavaComponent } from './Components/ObjavaComponent/ObjavaComponent'
import { ObjavaContractAddress } from './config';
import {ethers} from 'ethers';
import Blog from './utils/Blog.json'

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState('');
  const [dataList, setDataList] = useState([]);
  const [input, setInput] = useState('');

  async function updatePosts() {
    try {
      const {ethereum} = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ObjavaContract = new ethers.Contract(
          ObjavaContractAddress,
          Blog.abi,
          signer
        )

        let novaObjava = await ObjavaContract.dodajObjavo(input);

        setInput("");

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
      console.log(chainId);
      /*if(chainId != '0x5')
      {
        alert("You are not on Goerli Testnet!");
        setCorrectNetwork(false);
        return;
      }
      else
      {*/
        setCorrectNetwork(true);
      //}

      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      console.log(accounts);
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
          Blog.abi,
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
    initialize();
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
      ) : correctNetwork ? (
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
      ) : (
        <div>
          <h1 style={{textAlign: 'center'}}>ETHEREUM BLOGCHAIN</h1>
          <p>Please connect your Goerli Testnet Wallet and reload the page.</p>
        </div>
    )}
    </div>
  );
}

export default App;
