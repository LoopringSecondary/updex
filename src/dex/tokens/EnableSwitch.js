import React from 'react'
import {connect} from 'dva'
import {Switch} from 'antd'
import config from '../../common/config'
import storage from 'modules/storage'
import {toBig, toHex, toNumber} from "LoopringJS/common/formatter";
import Contracts from 'LoopringJS/ethereum/contracts/Contracts'
import {isApproving} from "modules/transactions/formatters";
import  TokenFormatter from 'modules/tokens/TokenFm'
import {signTx} from "../../common/utils/signUtils";
import eachOfLimit from "async/eachOfLimit";
import Notification from 'LoopringUI/components/Notification'

class EnableSwitch extends React.Component {
  render() {
    const {symbol, size = "small", balances,pendingTx} = this.props
    const balance  = balances.find(item =>item.symbol.toLowerCase() === symbol.toLowerCase())
    const tokenFm = new TokenFormatter({symbol})
    const loading = !!isApproving(pendingTx.items, symbol)
    const pendingAllowance = toBig(loading ? tokenFm.getUnitAmount(isApproving(pendingTx.items, symbol)) : balance ? balance.allowance : toBig(0))

    const onChange = async (checked) => {
      if (checked) {
        const txs = []
        const {gas} = this.props;
        const gasPrice = toHex(toBig(gas.tabSelected === 'estimate' ? gas.gasPrice.estimate : gas.gasPrice.current).times(1e9))
        const gasLimit = config.getGasLimitByType('approve').gasLimit
        const address = (window.Wallet && window.Wallet.address) || storage.wallet.getUnlockedAddress()
        let nonce = toHex((await window.RELAY.account.getNonce(address)).result)
        const tx = {
          chainId: config.getChainId(),
          gasPrice,
          gasLimit,
          value: '0x0',
          to: config.getTokenBySymbol(symbol).address
        }
        if (pendingAllowance.gt(0)) {
          txs.push({...tx, nonce,data:Contracts.ERC20Token.encodeInputs('approve', {_spender: config.getDelegateAddress(), _value:"0x0"})})
          nonce = toHex(toNumber(nonce) +1)
        }
        txs.push({...tx,nonce,data:Contracts.ERC20Token.encodeInputs('approve', {_spender: config.getDelegateAddress(), _value:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"})})

        eachOfLimit(txs, 1, async (item, key, callback) => {
          signTx(item).then(res => {
            if (res.result) {
              window.ETH.sendRawTransaction(res.result).then(resp => {
                if (resp.result) {
                  window.RELAY.account.notifyTransactionSubmitted({
                    txHash: resp.result,
                    rawTx: item,
                    from: address
                  })
                  callback()
                } else {
                  callback(resp.error)
                }
              })
            } else {
              callback(res.error)
            }
          })
        }, async function (e) {

          if(!e){
            Notification.open({
              description:'enable 成功',
              type: 'success',
            })
          }else{
            Notification.open({
              description:'enable 失败',
              type: 'error',
            })
          }
        })
      }
    };

    return (
      <Switch size={size} onChange={onChange} defaultChecked = {pendingAllowance.gt(1e6)}  loading={loading && pendingAllowance.gt(1e6)} disabled={pendingAllowance.gt(1e6)}/>
    )
  }
}

function mapStateToProps(state) {
  return {
    gas: state.gas,
    pendingTx: state.sockets.pendingTx,
    balances:state.sockets.balance.items
  }
}


export default connect(mapStateToProps)(EnableSwitch)

