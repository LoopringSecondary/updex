import React from 'react'
import {connect} from 'react-redux'
import {toFixed, getDisplaySymbol} from 'LoopringJS/common/formatter'
import {calculateWorthInLegalCurrency} from '../orders/formatters'

class NumberOfTodos extends React.Component {
  render() {
    const {balance, txs, allocates} = this.props
    let numberofTodos = 0
    const lrcFee  = allocates['frozenLrcFee'] || 0 ;
    const symbols = Object.keys(allocates)
    if(balance.items.length !== 0){
      symbols.forEach((symbol, index) => {
        if(symbol.toLocaleLowerCase() !== "frozenlrcfee"){
          const value = allocates[symbol]
          console.log(allocates)
          const assets = getBalanceBySymbol({balances: balance.items, symbol: symbol})
          let selling = toBig(value)
          if (symbol.toUpperCase() === 'LRC') {
            selling = selling.plus(toBig(lrcFee))
          }
          if (selling.gt(assets.balance)) {
            numberofTodos = numberofTodos + 1
          }
          let allowance = assets.allowance
          if (selling.gt(allowance)) {
            numberofTodos = numberofTodos + 1
          }
        }
      })
    }

    numberofTodos = numberofTodos + txs.filter(tx => tx.type.toLowerCase() === 'convert_income').length
    return `${numberofTodos}`
  }
}
export default connect((state)=>({
  balance: state.sockets.balance,
  txs: state.sockets.pendingTx.items,
  allocates: state.sockets.orderAllocateChange.items,
}))(NumberOfTodos)
