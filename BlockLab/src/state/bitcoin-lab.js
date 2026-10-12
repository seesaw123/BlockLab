import { makeKeys, sign, verify } from '../lib/lab-keys.js';
import { sha256 } from '../lib/sha256.js';
export const FEE = 1000;
export function parseBTC(text) {
  if (!/^\d+(\.\d{1,8})?$/.test(String(text))) throw Error('amount');
  const [whole, fraction = ''] = String(text).split('.');
  const n = Number(whole) * 100000000 + Number(fraction.padEnd(8, '0'));
  if (!Number.isSafeInteger(n) || n <= 0 || n > 21000000 * 100000000) throw Error('amount'); return n;
}
export const formatBTC = sats => (sats / 100000000).toFixed(8);
export const transactionMessage = tx => JSON.stringify({ from: tx.from, to: tx.to, inputs: tx.inputs, outputs: tx.outputs, fee: tx.fee, sequence: tx.sequence });
export class BitcoinLab {
  constructor() { this.wallets = []; this.utxos = []; this.mempool = []; this.blocks = []; this.sequence = 0; }
  createWallet() {
    if (this.wallets.length >= 2) throw Error('walletLimit');
    const w = { name: this.wallets.length ? 'Bob' : 'Alice', ...makeKeys(), funded: false };
    this.wallets.push(w); return w;
  }
  fund(address) {
    const w = this.wallets.find(w => w.address === address); if (!w) throw Error('wallet'); if (w.funded) throw Error('funded');
    this.utxos.push({ id: 'faucet:' + this.sequence++, address, sats: 100000000, locked: false }); w.funded = true;
  }
  balance(address) { return this.utxos.filter(u => u.address === address && !u.locked).reduce((a, u) => a + u.sats, 0); }
  pending(address) { return this.mempool.reduce((a, tx) => a + tx.outputs.filter(o => o.address === address).reduce((s, o) => s + o.sats, 0), 0); }
  send(from, to, amount) {
    const sender = this.wallets.find(w => w.address === from);
    if (!sender || !this.wallets.some(w => w.address === to) || from === to) throw Error('wallet');
    const sats = parseBTC(amount), inputs = []; let total = 0;
    for (const u of this.utxos.filter(u => u.address === from && !u.locked)) { inputs.push(u); total += u.sats; if (total >= sats + FEE) break; }
    if (total < sats + FEE) throw Error('balance');
    const outputs = [{ address: to, sats }]; if (total > sats + FEE) outputs.push({ address: from, sats: total - sats - FEE });
    const tx = { from, to, amount: sats, inputs: inputs.map(u => u.id), outputs, fee: FEE, sequence: this.sequence++, publicKey: sender.publicKey };
    tx.signature = sign(transactionMessage(tx), sender.privateKey);
    tx.id = sha256(transactionMessage(tx) + tx.signature);
    if (!this.valid(tx)) throw Error('signature');
    inputs.forEach(u => { u.locked = true; }); this.mempool.push(tx); return tx;
  }
  valid(tx) {
    const sender = this.wallets.find(w => w.address === tx.from);
    return !!sender && sender.publicKey === tx.publicKey && verify(transactionMessage(tx), tx.signature, tx.publicKey);
  }
  mine() {
    if (this.mempool.some(tx => !this.valid(tx))) throw Error('signature');
    const height = this.blocks.length + 1, transactions = [...this.mempool], previous = this.blocks.at(-1)?.hash || '0'.repeat(64);
    const used = new Set(transactions.flatMap(tx => tx.inputs)); this.utxos = this.utxos.filter(u => !used.has(u.id));
    for (const tx of transactions) tx.outputs.forEach((o, i) => this.utxos.push({ id: tx.id + ':' + i, ...o, locked: false }));
    const block = { height, previous, transactions, hash: sha256(JSON.stringify({ height, previous, ids: transactions.map(tx => tx.id) })) };
    this.blocks.push(block); this.mempool = []; return block;
  }
}
