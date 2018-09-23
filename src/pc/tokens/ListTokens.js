import React from 'react'
import {connect} from 'dva'
import {TickersFm,TickerFm} from 'modules/tickers/formatters'
import storage from '../../modules/storage'
import intl from 'react-intl-universal'
import routeActions from 'common/utils/routeActions'
import { ListView,Button,Tabs,NavBar,Icon,SegmentedControl,Grid } from 'antd-mobile'
import { Switch,Icon as WebIcon,Badge} from 'antd'
import TokensFm from 'modules/tokens/TokensFm'

const TokenItem = ({item={},actions,key,index})=>{
    // if(!item){ return null }
    // const tickerFm = new TickerFm(item)
    console.log('todo item',item)
    const gotoDetail = ()=>{
      routeActions.gotoPath('/tokenDetail')
    }
    return (
      <div className="row ml0 mr0 pt15 align-items-center no-gutters" onClick={gotoDetail}>
        <div className="col text-center">
            <i className={`icon-token-${item.symbol} fs20 d-block m-auto bg-primary color-black-1`} style={{width:'36px',height:'36px',lineHeight:'36px',borderRadius:'50em'}}></i>
        </div>
        <div hidden className="col text-left">
          <div>
            <div className="fs16 color-black-2">
              {item.symbol}
            </div>
            <div hidden className="fs14 color-black-3">
              {item.name}
            </div>

          </div>
        </div>
        <div hidden className="col-auto text-right">
          <div className="color-black-2 fs16">
            0.000000
          </div>
          <div className="fs14 color-black-3">
            $ 0.0000
          </div>
        </div>
      </div>
    )
}


const TokenListComp = (props)=>{
  const {tokens,balance,marketcap, dispatch} = props
  const tokensFm = new TokensFm({tokens, marketcap, balance})
  const formatedTokens = tokensFm.getList()

  const showLayer = (payload={})=>{
    dispatch({
      type:'layers/showLayer',
      payload:{
        ...payload
      }
    })
  }
  const showReceive = (symbol) => {
    dispatch({type: 'layers/showLayer', payload: {id: 'receiveToken',symbol}});
  }

  const showConvert = (token) => {
    routeActions.gotoPath(`/dex/convert/${token}`)
    // dispatch({type: 'layers/showLayer', payload: {id: 'convertToken',token}});
  }
  const showActions = (symbol) => {
    dispatch({type: 'layers/showLayer', payload: {id: 'helperOfTokenActions',symbol,hideBuy:false}});
  }

  return (
    <div className="fs20">
      {
        formatedTokens.map((token,index)=>{
          return (
            <TokenItem item={token} key={index}/>
          )
        })
      }
    </div>
  )
}
export default connect(({
  sockets,
  tokens
}) => ({
  balance:sockets.balance,
  marketcap:sockets.marketcap,
  tokens
}))(TokenListComp)
