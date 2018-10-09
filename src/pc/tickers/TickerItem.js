import React from 'react';
import { connect } from 'dva';
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import Worth from 'modules/settings/Worth'
import {formatPrice} from 'modules/orders/formatters'
import {TickerFm} from 'modules/tickers/formatters'
import { Icon as WebIcon} from 'antd';

const TickerItem = connect(({sockets:{tickers}})=>({tickers}))(({tickers,dispatch})=>{
  const tickerFm = new TickerFm(tickers.item.loopr || {})
  const tokens = tickerFm.getTokens()
  const direction = tickerFm.getChangeDirection()
  const price = tickerFm.getLast() && formatPrice(tokens.left, tokens.right, tickerFm.getLast())
  let color,prefix
  if(direction === 'up'){
    color = "color-success"
    prefix = '+'
  }
  if(direction === 'down'){
    color = "color-error"
    // prefix = '-' // no need minus
  }
  if(direction === 'none'){
    color = "text-primary"
  }
  const showLayer = (id)=>{
    dispatch({
      type:'layers/showLayer',
      payload:{
        id
      }
    })
  }
  const toggleLayer = (id)=>{
    dispatch({
      type:'layers/toggleLayer',
      payload:{
        id
      }
    })
  }
  return (
      <div className="row ml0 mr0 no-gutters align-items-stretch fs18 text-number" style={{height:'100%'}}>
        <div onClick={toggleLayer.bind(this,'SidebarOfMarkets')} className="cursor-pointer col-auto zb-b-r hover-bg-primary d-flex align-items-center" >
           <div className={`pl20`}>
            <WebIcon type="menu-fold" className="fs20 mr20 text-primary font-weight-bold" />
            <span className="fs20 font-weight-bold text-primary mr30">{tokens.left} / {tokens.right}</span>
            { false && <WebIcon type="caret-down" className="mr30 text-primary" /> }
            { false && <i className="icon-star color-black-4 fs18 mr30"></i> }
            { false && <i className="icon-star color-black fs18 mr30"></i> }
          </div>
        </div>
        {
          false &&
          <div className="col-auto pl20 pr20 d-flex align-items-center zb-b-r">
            { true && <i className="icon-star color-black-4 fs18"></i> }
            { false && <i className="icon-star text-primary fs18"></i> }
          </div>
        }
        <div className="col-auto pl20 pr25 d-flex align-items-center">
          <div>
            <div className={`${color}`}>
              {price}
              <span className="ml5">
                <Worth amount={price} symbol={tokens.right}/>
              </span>
            </div>
            <div className="color-black-4 fs12 lh15">
              {intl.get('ticker.last')}
            </div>
          </div>
        </div>
        <div className="col-auto pr25 d-flex align-items-center">
          <div>
            <div className={`${color}`}>
              {prefix}{tickerFm.getChange()}
            </div>
            <div className="color-black-4 fs12 lh15">
              {intl.get('ticker.change')}
            </div>
          </div>
        </div>
        <div className="col-auto pr25 d-flex align-items-center">
          <div>
            <div className="color-black-1">
              {tickerFm.getHigh()}
            </div>
            <div className="color-black-4 fs12 lh15">
              {intl.get('ticker.high')}
            </div>
          </div>
        </div>
        <div className="col-auto pr25 d-flex align-items-center">
          <div>
            <div className="color-black-1">
              {tickerFm.getLow()}
            </div>
            <div className="color-black-4 fs12 lh15">
              {intl.get('ticker.low')}
            </div>
          </div>
        </div>
        <div className="col-auto pr25 d-flex align-items-center">
          <div>
            <div className="color-black-1">
              {tickerFm.getVol()} {tokens.right}
            </div>
            <div className="color-black-4 fs12 lh15">
              {intl.get('ticker.vol')}
            </div>
          </div>
        </div>
      </div>
  )
})

export default TickerItem









