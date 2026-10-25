import { useState } from 'react';
import './RegtestLab.css';

const randomHex = () => Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join('');
const randomAddress = () => 'bcrt1q' + Array.from({length:38}, () => 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'[Math.floor(Math.random()*32)]).join('');
const initial = { blocklab: null, student1: null, height: 0, mempool: [], transactions: [] };
export function RegtestLab() {
  const [state,setState] = useState(initial);
  const [message,setMessage] = useState('Create BlockLab to begin your experiment.');
  const [amount,setAmount] = useState('1');
  const {blocklab,student1,height,mempool,transactions} = state;
  const confirmations = tx => tx.minedAt == null ? 0 : height - tx.minedAt + 1;
  const confirmedReceived = transactions.filter(t=>confirmations(t)>0).reduce((v,t)=>v+t.amount,0);
  const create = name => {setState(s=>({...s,[name]:{address:randomAddress(),balance:0}}));setMessage(name+' wallet created.');};
  const mine = count => {
    if (!blocklab) return;
    setState(s=>{
      const matured = s.height < 101 && s.height+count >=101 ? 50 : 0;
      return {...s,height:s.height+count,blocklab:{...s.blocklab,balance:s.blocklab.balance+matured},
        transactions:s.transactions.map(t=>t.minedAt==null?{...t,minedAt:s.height+1}:t),mempool:[]};
    });
    setMessage(count+' simulated block(s) generated. Pending transactions are now confirmed.');
  };
  const send = () => {
    const n=Number(amount),fee=0.0000015;
    if(!blocklab||!student1||!Number.isFinite(n)||n<=0||n+fee>blocklab.balance){setMessage('Create both wallets and enter an amount within the available balance.');return;}
    const tx={txid:randomHex(),amount:n,fee,minedAt:null};
    setState(s=>({...s,blocklab:{...s.blocklab,balance:Number((s.blocklab.balance-n-fee).toFixed(8))},transactions:[...s.transactions,tx],mempool:[...s.mempool,tx]}));
    setMessage('Transaction entered the simulated mempool. Mine a block to confirm it.');
  };
  const command = !blocklab ? './bitcoin-cli -regtest createwallet "blocklab"' : height<101 ? './bitcoin-cli -regtest -rpcwallet=blocklab getnewaddress\n./bitcoin-cli -regtest generatetoaddress 101 "YOUR_ADDRESS"' : !student1 ? './bitcoin-cli -regtest createwallet "student1"\n./bitcoin-cli -regtest -rpcwallet=student1 getnewaddress' : mempool.length ? './bitcoin-cli -regtest getrawmempool\n./bitcoin-cli -regtest generatetoaddress 1 "YOUR_ADDRESS"' : './bitcoin-cli -regtest -rpcwallet=blocklab sendtoaddress "STUDENT1_ADDRESS" 1\n./bitcoin-cli -regtest -rpcwallet=student1 listtransactions';
  return <div className="rt-lab">
    <p><strong>Browser simulation:</strong> This teaching activity is not connected to Bitcoin Core, and all BTC shown is simulated.</p>
    <div className="rt-stats"><div><small>Block height</small><strong>{height}</strong></div><div><small>Pending transactions</small><strong>{mempool.length}</strong></div><div><small>BlockLab available</small><strong>{blocklab?blocklab.balance.toFixed(6):'—'} BTC</strong></div><div><small>Student1 confirmed</small><strong>{confirmedReceived.toFixed(6)} BTC</strong></div></div>
    <div className="rt-panels">
      <section><h3>Wallets</h3><p>BlockLab: {blocklab?blocklab.address:'Not created'}</p><button className="btn small" disabled={!!blocklab} onClick={()=>create('blocklab')}>Create BlockLab wallet</button><p>Student1: {student1?student1.address:'Not created'}</p><button className="btn small" disabled={!blocklab||!!student1} onClick={()=>create('student1')}>Create Student1 wallet</button></section>
      <section><h3>Mining</h3><p>Mine 101 blocks to mature the first 50 test BTC reward.</p><button className="btn small" disabled={!blocklab||height>=101} onClick={()=>mine(101)}>Mine 101 blocks</button><button className="btn small" disabled={!blocklab||height<101} onClick={()=>mine(1)}>Mine 1 block</button><button className="btn small" disabled={!blocklab||height<101} onClick={()=>mine(5)}>Mine 5 blocks</button></section>
      <section><h3>Send test Bitcoin</h3><label htmlFor="rt-amount">Amount (test BTC)</label><input id="rt-amount" type="number" min="0.00001" step="0.1" value={amount} onChange={e=>setAmount(e.target.value)}/><p>From BlockLab → Student1</p><button className="btn small" disabled={!student1||!blocklab||height<101} onClick={send}>Send transaction</button></section>
    </div>
    <p role="status" className="rt-status">{message}</p>
    <h3>Mempool</h3>{mempool.length?<ul>{mempool.map(t=><li key={t.txid}><code>{t.txid}</code> — {t.amount} BTC, unconfirmed</li>)}</ul>:<p>No pending transactions.</p>}
    <h3>Transaction explorer</h3>{transactions.length?<ul>{transactions.map(t=><li key={t.txid}><code>{t.txid}</code><br/>{t.amount} BTC · {confirmations(t)} confirmation(s)</li>)}</ul>:<p>Send your first transaction to explore its confirmation status.</p>}
    <div className="rt-command"><strong>Matching real Bitcoin Core commands</strong><p>These commands are examples to run on your own Regtest node, not executed by this demo.</p><pre><code>{command}</code></pre></div>
    <button className="pl-link" onClick={()=>{setState(initial);setMessage('Simulation reset.');}}>Reset simulation</button>
  </div>;
}
