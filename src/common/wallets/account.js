import validator from 'LoopringJS/ethereum/validator';
import {addHexPrefix, clearHexPrefix, formatAddress, formatKey, toBuffer, toHex, toNumber} from 'LoopringJS/common/formatter';
import {decryptKeystoreToPkey, pkeyToKeystore} from 'LoopringJS/ethereum/keystore';
import {privateToAddress, privateToPublic, publicToAddress, sha3, hashPersonalMessage, ecsign} from 'ethereumjs-util';
import {mnemonictoPrivatekey} from 'LoopringJS/ethereum/mnemonic';
import {generateMnemonic} from 'bip39';
import {trimAll} from 'LoopringJS/common/utils';
import HDKey from 'hdkey';
import EthTransaction from 'ethereumjs-tx';
import {getOrderHash} from 'LoopringJS/relay/rpc/order';
import * as Trezor from 'LoopringJS/ethereum/trezor';
import * as Ledger from 'LoopringJS/ethereum/ledger';
import * as MetaMask from 'LoopringJS/ethereum/metaMask';
import Wallet from 'ethereumjs-wallet';
import { keccakHash } from 'LoopringJS/common/utils'
import moment from 'moment'
import {LedgerAccount as LedgerAcc, MetaMaskAccount as MetaMaskAcc} from 'LoopringJS/ethereum/account'
import intl from "react-intl-universal";
import Notification from 'LoopringUI/components/Notification'

const wallets = require('LoopringJS/config/wallets.json');
const LoopringWallet = wallets.find(wallet => trimAll(wallet.name).toLowerCase() === 'loopringwallet');
export const path = LoopringWallet.dpath;

export function createWallet ()
{
    return Wallet.generate();
}

/**
 * @description Returns the ethereum address of a given public key.
 * Accepts "Ethereum public keys" and SEC1 encoded keys.
 * @param publicKey Buffer | string
 * @param sanitize bool [sanitize=false] Accept public keys in other formats
 * @returns {string}
 */
export function publicKeytoAddress (publicKey, sanitize)
{
    publicKey = toBuffer(publicKey);
    return formatAddress(publicToAddress(publicKey, sanitize));
}

/**
 *
 * @param publicKey
 * @param chainCode
 * @param pageSize
 * @param pageNum
 * @returns {<Array>}
 */
export function getAddresses ({publicKey, chainCode, pageSize, pageNum})
{
    const addresses = [];
    const hdk = new HDKey();
    hdk.publicKey = publicKey instanceof Buffer ? publicKey : toBuffer(addHexPrefix(publicKey));
    hdk.chainCode = chainCode instanceof Buffer ? chainCode : toBuffer(addHexPrefix(chainCode));
    for (let i = 0; i < pageSize; i++)
    {
        const dkey = hdk.derive(`m/${i + pageSize * pageNum}`);
        addresses.push(publicKeytoAddress(dkey.publicKey, true));
    }
    return addresses;
}

/**
 * @description generate mnemonic
 * @param strength
 * @returns {*}
 */
export function createMnemonic (strength)
{
    return generateMnemonic(strength || 256);
}

export class Account
{
    getAddress ()
    {
        throw Error('unimplemented');
    }

    getUnlockType ()
    {
        throw Error('unimplemented');
    }

    /**
   * @description sign
   * @param hash
   */
    sign (hash)
    {
        throw Error('unimplemented');
    }

    /**
   * @description Returns serialized signed ethereum tx
   * @param rawTx
   * @returns {string}
   */
    signEthereumTx (rawTx)
    {
        throw Error('unimplemented');
    }

    /**
   * @description Returns given order along with r, s, v
   * @param order
   */
    signOrder (order)
    {
        throw Error('unimplemented');
    }

    /**
   * @description Calculates an Ethereum specific signature with: sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))).
   * @param message string
   */
    signMessage (message)
    {
        throw Error('unimplemented');
    }

    sendTransaction (ethNode, signedTx)
    {
        return ethNode.sendRawTransaction(signedTx);
    }
}

export class AddressAccount extends Account
{
  constructor (address)
  {
    super();
    try
    {
      validator.validate({value: address, type: 'ETH_ADDRESS'});
    } catch (e)
    {
      throw new Error('Invalid ETH address');
    }
    this.address = address
  }

  getAddress ()
  {
    return this.address
  }

  getUnlockType ()
  {
    return 'address'
  }

  signMessage (message)
  {
    //TODO
  }

  signEthereumTx (rawTx)
  {
    //TODO
  }

  async signOrder (order)
  {
    const unsign = [{type:'order', data:order}]
    window.STORE.dispatch({type:'placeOrderSteps/unsign', payload: {unsign, signWith:'address'}})
    window.STORE.dispatch({type: 'layers/hideLayer', payload: {id: 'placeOrderSteps'}})
    window.STORE.dispatch({type: 'layers/showLayer', payload: {id: 'auth2'}})
  }

  async signOrderHelper (order)
  {
    return await this.signOrder(order)
  }
}

export class LooprAccount extends Account
{
  constructor (address)
  {
    super();
    this.address = address
  }

  async getAddress ()
  {
    return this.address
  }

  getUnlockType ()
  {
    return 'loopr'
  }

  async signMessage (message)
  {
    //TODO
  }

  async signEthereumTx (rawTx)
  {
    //TODO
  }

  async signOrder (order)
  {
    const hash = keccakHash(JSON.stringify([{type:"order",data:order}]))
    window.RELAY.order.setTempStore(hash, JSON.stringify([{type:"order",data:order}])).then(res => {
      const signWith = window.WALLET.getUnlockType()
      const qrcode = JSON.stringify({type:'sign', value:hash})
      const time = moment().valueOf()
      window.STORE.dispatch({type:'placeOrderSteps/qrcodeGenerated', payload: {signWith, qrcode, hash, time}})
      if (!res.error) {
        window.STORE.dispatch({type: 'layers/hideLayer', payload: {id: 'placeOrderSteps'}})
        window.STORE.dispatch({type: 'layers/showLayer', payload: {id: 'helperOfSignStepPC'}})
      }
    })
  }
}

export class UpWalletAccount extends Account
{
  constructor (address)
  {
    super();
    this.address = address
  }

  async getAddress ()
  {
    return this.address
  }

  getUnlockType ()
  {
    return 'upWallet'
  }

  async signMessage (message)
  {
    //TODO
  }

  async signEthereumTx (rawTx)
  {
    //TODO
  }

  async signOrder (order)
  {
    const hash = keccakHash(JSON.stringify([{type:"order",data:order}]))
    window.RELAY.order.setTempStore(hash, JSON.stringify([{type:"order",data:order}])).then(res => {
      const signWith = window.WALLET.getUnlockType()
      const qrcode = JSON.stringify({type:'sign', value:hash})
      const time = moment().valueOf()
      window.STORE.dispatch({type:'placeOrderSteps/qrcodeGenerated', payload: {signWith, order, qrcode, hash, time}})
      if (!res.error) {
        window.STORE.dispatch({type: 'layers/hideLayer', payload: {id: 'placeOrderSteps'}})
        window.STORE.dispatch({type: 'layers/showLayer', payload: {id: 'helperOfSignStepPC'}})
      }
    })
  }
}

export class LedgerAccount extends Account
{
    constructor (ledger, dpath)
    {
        super();
        this.ledgerAcc = new LedgerAcc(ledger, dpath)
    }

    async getAddress ()
    {
        return await this.ledgerAcc.getAddress()
    }

    getUnlockType ()
    {
        return 'ledger'
    }

    async signMessage (message)
    {
        return await this.ledgerAcc.signMessage(message)
    }

    async signEthereumTx (rawTx)
    {
      return await this.ledgerAcc.signEthereumTx(rawTx)
    }

    async signOrder (order)
    {
      return await this.ledgerAcc.signOrder(order)
    }
}

export class MetaMaskAccount extends Account
{
    constructor (web3)
    {
        super();
        if (web3 && web3.eth.accounts[0])
        {
            this.metaMask = new MetaMaskAcc(web3)
        }
    }

    getAddress ()
    {
        return this.metaMask.getAddress()
    }

    getUnlockType ()
    {
        return 'metaMask'
    }

    async sign (hash)
    {
        return this.metaMask.sign(hash)
    }

    async signMessage (message)
    {
      return this.metaMask.signMessage(message)
    }

    async signEthereumTx (rawTx)
    {
        return this.metaMask.signEthereumTx(rawTx)
    }

    async signOrder (order)
    {
      return this.metaMask.signOrder(order)
    }
}
