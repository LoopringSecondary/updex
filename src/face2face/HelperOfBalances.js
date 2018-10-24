import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import routeActions from 'common/utils/routeActions'
import {getTokensByMarket} from 'modules/formatter/common'
import * as tokenFormatter from 'modules/tokens/TokenFm'
import {FormatAmount} from 'modules/formatter/FormatNumber'
import {toNumber,toBig,toFixed} from "LoopringJS/common/formatter";
import intl from 'react-intl-universal'



const HelperOfBalance = (props)=>{
  const {dispatch,tokenS,tokenB,balance} = props
  const showLayer = (payload={})=>{
    dispatch({
      type:'layers/showLayer',
      payload:{
        ...payload
      }
    })
  }
  const relatedTokens = []
  const balanceS = {
    symbol:tokenS,
    name:tokenS,
    ...tokenFormatter.getBalanceBySymbol({balances:balance, symbol:tokenS, toUnit:true}),
  }
  const balanceB = {
    symbol:tokenB,
    name:tokenB,
    ...tokenFormatter.getBalanceBySymbol({balances:balance, symbol:tokenB, toUnit:true})
  }
  relatedTokens.push(balanceS)
  relatedTokens.push(balanceB)
  if(tokenS === 'WETH' || tokenB === 'WETH') {
    relatedTokens.push({
      symbol:'ETH',
      name:'ETH',
      ...tokenFormatter.getBalanceBySymbol({balances:balance, symbol:'ETH', toUnit:true})
    })
  }
  const gotoReceive = ({symbol})=>{
    showLayer({id:'receiveToken',symbol})
  }
  const gotoConvert = ({type})=>{
    routeActions.gotoPath(`/dex/convert/${type}`)
  }
  const gotoAll = (payload)=>{
  }

  return (
    <div className="fs20">
      <table className="w-100 fs12">
        <thead>
          <tr className="">
            <th className="text-left zb-b-b pl15 pr10 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.token')}</th>
            <th className="text-left zb-b-b pl10 pr10 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.balance')}</th>
            <th className="text-right zb-b-b pl10 pr15 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
            {
              relatedTokens.map((token,index)=>
                <tr key={index}>
                  <td className="text-left pl15 pr10 pt10 pb10 zb-b-b color-black-2">
                    {token.symbol}
                    <span hidden className="color-black-3 ml5">{token.name}</span>
                  </td>
                  <td className="text-left pl10 pr10 pt10 pb10 zb-b-b color-black-2">{toFixed(token.balance, 8)}</td>
                  <td className="text-right pl10 pr15 pt10 pb10 zb-b-b color-black-2">
                    {
                      token.symbol === 'WETH' &&
                      <Button className="fs12 d-inline-block pl15 pr15 bg-primary-light text-primary border-none" style={{height:'24px',lineHeight:'24px'}} type="primary" size="small" onClick={showLayer.bind(this,{id:'convertToken',type:"ETH"})}>{intl.get('common.convert')}</Button>
                    }
                    {
                      token.symbol !== 'WETH' &&
                      <Button className="fs12 d-inline-block pl15 pr15 bg-primary-light text-primary border-none" style={{height:'24px',lineHeight:'24px'}} type="primary" size="small" onClick={(e) => {e.stopPropagation();gotoReceive({symbol:token.symbol})}}>{intl.get('common.receive')}</Button>
                    }
                  </td>
                </tr>
              )
            }
        </tbody>
      </table>
    </div>
  )
}
export default connect(({
  p2pOrder:{tokenS,tokenB},
  sockets,
})=>({
  tokenS,tokenB,balance:sockets.balance.items
}))(HelperOfBalance)





