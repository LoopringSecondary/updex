import React from 'react'
import { connect } from 'dva'
import { Button } from 'antd-mobile'
import { Icon} from 'antd'
import EnableSwitch from '../tokens/EnableSwitch'
import routeActions from 'common/utils/routeActions'
import { getTokensByMarket } from 'modules/formatter/common'
import * as tokenFormatter from 'modules/tokens/TokenFm'
import {toFixed } from 'LoopringJS/common/formatter'
import intl from 'react-intl-universal'
import Available from 'modules/tokens/Available'

const HelperOfBalance = (props)=>{
  const {dispatch,pair,balance} = props
  const marketTokens = getTokensByMarket(pair)
  const showLayer = (payload={})=>{
    dispatch({
      type:'layers/showLayer',
      payload:{
        ...payload
      }
    })
  }
  const tokens = getTokensByMarket(pair)
  const relatedTokens = new Array()
  const balanceL = {
    symbol:tokens.left,
    name:tokens.left,
    ...tokenFormatter.getBalanceBySymbol({balances:balance, symbol:tokens.left, toUnit:true}),
  }
  const balanceR = {
    symbol:tokens.right,
    name:tokens.right,
    ...tokenFormatter.getBalanceBySymbol({balances:balance, symbol:tokens.right, toUnit:true})
  }
  relatedTokens.push(balanceL)
  relatedTokens.push(balanceR)
  // if(tokens.right === 'WETH') {
  //   relatedTokens.push({
  //     symbol:'ETH',
  //     name:'ETH',
  //     ...tokenFormatter.getBalanceBySymbol({balances:balance, symbol:'ETH', toUnit:true})
  //   })
  // }
  const gotoReceive = (payload)=>{
    showLayer({id:'receiveToken',...payload})
  }
  const showActions = (payload)=>{
    showLayer({id:'helperOfTokenActions',...payload})
  }

  const gotoConvert = (payload)=>{
    // showLayer({id:'convertToken',...payload})
    routeActions.gotoPath(`/dex/convert/${payload.token}`)
    // showLayer({id:'convertToken',...payload})
  }
  const gotoAll = (payload)=>{
    // TODO
    // routeActions.gotoPath('/dex/convert')
  }

  return (
    <div className="fs20">
      <table className="w-100 fs12">
        <thead>
          <tr className="">
            <th className="text-left zb-b-b pl10 pr5 pt5 pb5 font-weight-normal color-black-4 text-nowrap">{intl.get('common.token')}</th>
            <th className="text-left zb-b-b pl5 pr5 pt5 pb5 font-weight-normal color-black-4 text-nowrap">{intl.get('common.balance')}</th>
            <th className="text-left zb-b-b pl5 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.available')}</th>
            <th className="text-center zb-b-b pl5 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('token_actions.enable_label_simple')}</th>
            <th className="text-right zb-b-b pl5 pr10 pt5 pb5 font-weight-normal color-black-4">{intl.get('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
            {
              relatedTokens.map((token,index)=>
                <tr key={index} onClick={()=>{}}>
                  <td className="pl10 pr5 pt10 pb10 zb-b-b color-black-2 text-left">
                    {token.symbol}
                  </td>
                  <td className="pl5 pr5 pt10 pb10 zb-b-b color-black-2 text-left">{toFixed(token.balance, 8)}</td>
                  <td className="pl5 pr5 pt10 pb10 zb-b-b color-black-2 text-left">
                    <div className="lh15 color-black-1"><Available symbol={token.symbol}/></div>
                  </td>
                  <td className="text-center pl5 pr5 pt10 pb10 zb-b-b color-black-2">
                    <EnableSwitch symbol={token.symbol} />
                  </td>
                  <td className="pl5 pr10 pt10 pb10 zb-b-b color-black-2 text-right text-nowrap">
                    {
                      token.symbol === 'WETH' &&
                      <Button onClick={showActions.bind(this,{symbol:token.symbol,hideBuy:true})} type="primary" style={{height:'2.4rem',lineHeight:'2.6rem'}} className="d-inline-block ml10 color-white border-none" size="small">
                        <Icon className="fs12" type="ellipsis" />
                      </Button>
                    }
                    {
                      token.symbol !== 'WETH' &&
                      <Button onClick={showActions.bind(this,{symbol:token.symbol,hideBuy:true})} type="primary" style={{height:'2.4rem',lineHeight:'2.6rem'}} className="d-inline-block ml10 color-white border-none" size="small">
                        <Icon className="fs12" type="ellipsis" />
                      </Button>
                    }
                  </td>
                </tr>
              )
            }
        </tbody>
      </table>
      <div className="zb-b-b color-black-4 text-center pt10 pb10 fs13" onClick={routeActions.gotoPath.bind(this,'/dex/usercenter/assets')}>
        <span className="">{intl.get('common.all')} {intl.get('common.assets')}</span>
      </div>
    </div>
  )
}
export default connect(({
  placeOrder:{pair},
  sockets,
})=>({
  pair,balance:sockets.balance.items
}))(HelperOfBalance)





