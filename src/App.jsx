import { useEffect, useState } from 'react'
import './App.css'
import * as SOLANA from "@solana/web3.js";
const { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } = SOLANA;

const SOLANA_CONNECTION = new Connection(clusterApiUrl('devnet'));



function App() {
  const [formData, setFormData] = useState({
    walletAdress: "",
    amount: 1
  })

  const handleChange = (event) => {
    setFormData(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { walletAdress, amount } = formData;
    console.log(`Requesting airdrop for ${walletAdress}`)

    try {
      // 1 - Request Airdrop
      const signature = await SOLANA_CONNECTION.requestAirdrop(
        new PublicKey(walletAdress),
        amount * LAMPORTS_PER_SOL
      );
      // 2 - Fetch the latest blockhash
      const { blockhash, lastValidBlockHeight } = await SOLANA_CONNECTION.getLatestBlockhash();
      // 3 - Confirm transaction success

      await SOLANA_CONNECTION.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature
      }, 'finalized');


      // 4 - Log results
      console.log(`Tx Complete: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
      document.querySelector('#seeTransaction').href = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
      document.querySelector('#seeTransaction').innerHTML = "See The transaction in solana explorer";
      document.querySelector('.popup h2').innerHTML = "Tx Sucessful";
      document.querySelector('.popup p').innerHTML = `sucessfull airdropped ${amount} devnet sol to ${walletAdress}`;
      document.querySelector('.popup').style.display = 'block';
    } catch (err) {
      console.log(err);
      document.querySelector('.popup h2').innerHTML = "Tx Unucessful";
      document.querySelector('.popup p').innerHTML = err;
      document.querySelector('#seeTransaction').href = '/';
      document.querySelector('#seeTransaction').innerHTML = "";
      document.querySelector('.popup').style.display = 'block';
    }







  }

  useEffect(() => {
    // window.addEventListener('load', function () {
    //   setTimeout(
    //     function open(event) {
    //       document.querySelector('.popup').style.display = 'block';
    //     },
    //     1000
    //   )
    // });
    document.querySelector('#close').addEventListener('click', function () {
      document.querySelector('.popup').style.display = 'none';
    });

  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="neon">Sol </div>
        <div className="flux">Bank </div>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="walletAdress">
          Wallet Address :
          <input
            type="text"
            name="walletAdress"
            placeholder="Enter your wallet adress here"
            value={formData.walletAdress}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="amount">
          Amount :
          <input
            type="number"
            min="1"
            name="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </label>
        <button>Airdrop to Devnet</button>
      </form>
      <div className="popup">
        <button id='close'>&times;</button>
        <h2>Automatic Pop-Up</h2>
        <p>Lorem, ipsum … dignissimos?</p>
        <a id="seeTransaction" target="_blank"></a>
        <a href='/' id="home">Home</a>
      </div>

    </div>
  )
}

export default App
