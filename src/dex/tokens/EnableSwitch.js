import React from 'react'
import {connect} from 'dva'
import {Switch,Icon} from 'antd'
import {Modal} from 'antd-mobile'
import config from '../../common/config'
import storage from 'modules/storage'
import {toBig, toHex, toNumber} from "LoopringJS/common/formatter";
import Contracts from 'LoopringJS/ethereum/contracts/Contracts'
import {isApproving} from "modules/transactions/formatters";
import  TokenFormatter from 'modules/tokens/TokenFm'
import {signTx} from "../../common/utils/signUtils";
import eachOfLimit from "async/eachOfLimit";
import Notification from 'LoopringUI/components/Notification'
import intl from 'react-intl-universal'


class EnableSwitch extends React.Component {
  render() {
    const {symbol, size = "small", balances,pendingTx,dispatch} = this.props
    const balance  = balances.find(item =>item.symbol.toLowerCase() === symbol.toLowerCase())
    const tokenFm = new TokenFormatter({symbol})
    const loading = !!isApproving(pendingTx.items, symbol)
    const pendingAllowance = toBig(loading ? tokenFm.getUnitAmount(isApproving(pendingTx.items, symbol)) : balance ? balance.allowance : toBig(0))

    const onChange = async (checked,e) => {
      console.log('EnableSwitch',e)
      if (checked) {
        Modal.alert(`${intl.get('todo_list.actions_enable')} ${symbol}`,intl.get('token_actions.enable_tip',{token:symbol}),[
          { text: intl.get('common.cancel'), onPress: () => console.log('cancel') },
          { text: intl.get('common.ok'), onPress: async () =>{
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
                txs.push({type:'approveZero',data:{...tx, nonce,data:Contracts.ERC20Token.encodeInputs('approve', {_spender: config.getDelegateAddress(), _value:"0x0"})}})
                nonce = toHex(toNumber(nonce) +1)
              }
              txs.push({type:'approve',data:{...tx,nonce,data:Contracts.ERC20Token.encodeInputs('approve', {_spender: config.getDelegateAddress(), _value:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"})}})
              dispatch({type: 'task/setTask', payload: {task:'sign', unsign:txs}})
            }},
        ])

      }
    };
    if(balance){
      if(toBig(balance.allowance).lt(1e8)){
        return (
          <span onClick={(e)=>{ e.preventDefault();e.stopPropagation() }}>
            <Switch size={size} onChange={onChange} checked = {pendingAllowance.gt(1e8)}  loading={loading && pendingAllowance.gt(1e8)} disabled={pendingAllowance.gt(1e8)}/>  
          </span>
        )
      }else{
        return <Icon type="check-circle" theme="filled" className="color-success"/>
      }
    }else{
      return <span className="">--</span>
    }

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

