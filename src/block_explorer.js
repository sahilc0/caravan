import axios from 'axios';
import BigNumber from 'bignumber.js';
import {
  satoshisToBitcoins,
  blockExplorerAPIURL,
} from "unchained-bitcoin";

/**
 * Fetch information for signing transactions from block explorer API
 * @param {string} address - The address from which to obtain the information
 * @param {string} network - The network for the transaction to sign (mainnet|testnet)
 * @returns {multisig.UTXO} object for signing transaction inputs
 */
export async function blockExplorerGetAddresesUTXOs(address, network) {
  try {
    const utxosResult = await axios.get(blockExplorerAPIURL(`/address/${address}/utxo`, network));
    const utxos = utxosResult.data;
    return await Promise.all(utxos.map(async (utxo) => {
      // FIXME: inefficient, need to cache here by utxo.txid
      const transactionResult = await axios.get(blockExplorerAPIURL(`/tx/${utxo.txid}/hex`, network));
      const transactionHex = transactionResult.data;
      const amount = new BigNumber(utxo.value);
      return {
        confirmed: utxo.status.confirmed,
        txid: utxo.txid,
        index: utxo.vout,
        amount: satoshisToBitcoins(amount).toFixed(8),
        amountSats: amount,
        transactionHex,
      };
    }));
  } catch(e) {
    throw((e.response && e.response.data) || e);
  }
}

export async function blockExplorerGetFeeEstimate(network) {
  try {
    const feeEstimatesResult = await axios.get(blockExplorerAPIURL('/fee-estimates', network));
    const feeEstimates = feeEstimatesResult.data;
    return Math.ceil(feeEstimates[2]);
  } catch(e) {
    throw((e.response && e.response.data) || e);
  }
}

export async function blockExplorerBroadcastTransaction(transactionHex, network) {
  try {
    const broadcastResult = await axios.post(blockExplorerAPIURL('/tx', network), transactionHex);
    return broadcastResult.data;
  } catch(e) {
    throw((e.response && e.response.data) || e);
  }
}

/**
 * @module block_explorer
 */

