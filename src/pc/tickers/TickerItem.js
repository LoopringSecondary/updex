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

  return (
      <div className="row ml0 mr0 no-gutters align-items-stretch fs16" style={{height:'100%'}}>
        <div className="col-auto zb-b-r pl15 d-flex align-items-center" style={{backgroundBak:"rgba(0,0,0,0)",widthBakBak:'41.7rem'}} >
           <div className={``}>
            <i className="icon-star color-black-4 fs18 mr20"></i>
            <span className="fs20 color-black-1 ">{tokens.left} / {tokens.right}</span>
            <WebIcon type="caret-down" className="ml30 mr20 color-black-4" />
          </div>
        </div>

        <div className="col-auto pl20 pr25 d-flex align-items-center">
          <div>
            <div className={`${color}`}>
              {price}
              <span className="color-black-4 ml5">
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









