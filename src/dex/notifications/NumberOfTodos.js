import React from 'react'
import { Link, Redirect, Route, Switch } from 'dva/router'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import { Badge } from 'antd'
import { connect } from 'dva'
import { toBig } from 'LoopringJS/common/formatter'
import { getBalanceBySymbol } from 'modules/tokens/TokenFm'


class NumberOfTodos extends React.Component {
  render() {
    const {balance, txs, allocates,hasBadge=true} = this.props
    let numberofTodos = 0
    const lrcFee  = allocates['frozenLrcFee'] || 0 ;
    const symbols = Object.keys(allocates)
    if(balance.items.length !== 0){
      symbols.forEach((symbol, index) => {
        if(symbol.toLocaleLowerCase() !== "frozenlrcfee"){
          const value = allocates[symbol]
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
    if(hasBadge){
      return <Badge count={numberofTodos} className="s-small">{this.props.children}</Badge>
    }else{
      return `${numberofTodos}`  
    }
    
  }
}
export default connect((state)=>({
  balance: state.sockets.balance,
  txs: state.sockets.pendingTx.items,
  allocates: state.sockets.orderAllocateChange.items,
}))(NumberOfTodos)
