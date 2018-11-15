import React from 'react'
import {connect} from 'react-redux'
import {toFixed, getDisplaySymbol} from 'LoopringJS/common/formatter'
import config from "../../common/config";
import storage from 'modules/storage'
import {toBig} from "LoopringJS/common/formatter";
import TokenFM, {getBalanceBySymbol} from 'modules/tokens/TokenFm'

class Available extends React.Component {
  state = {
    sale : toBig(0)
  }

  // componentDidMount() {
  // const {symbol}= this.props
  // const owner = (window.Wallet && window.Wallet.address) || storage.wallet.getUnlockedAddress()
  // window.RELAY.account.getEstimatedAllocatedAllowance({
  //   owner,
  //   delegateAddress: config.getDelegateAddress(),
  //   token: symbol
  // }).then(res => {
  //   if (res.result) {
  //     let sale = toBig(res.result)
  //     const tokenFm = new TokenFM({symbol})
  //     this.setState({sale : toBig(tokenFm.toPricisionFixed(tokenFm.getUnitAmount(sale)))})
  //   }
  // })
  // }

  available = (tokenBalance, sale) => {
    const value = tokenBalance.balance.minus(sale)
    return value.gt(0) ? toFixed(value, 8) : '0.00000000'
  }

  render() {
    const {symbol, allocates, balance}= this.props
    const tokenBalance = getBalanceBySymbol({balances: balance, symbol: symbol.toLowerCase(), toUnit: true})
    let selling = toBig(0)
    Object.keys(allocates).forEach((sym, index) => {
      if (sym.toLocaleLowerCase() === symbol.toLocaleLowerCase()) {
        selling = toBig(allocates[sym])
      }
    })
    const tokenFm = new TokenFM({symbol})
    const available = this.available(tokenBalance, tokenFm.getUnitAmount(selling))
    return tokenFm.shorterPrecision(available)
  }
}

export default connect(({sockets})=>({
  balance: sockets.balance.items,
  allocates: sockets.orderAllocateChange.items,
}))(Available)
