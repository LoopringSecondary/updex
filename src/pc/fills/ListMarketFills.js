import React from 'react';
import {FillFm} from 'modules/fills/formatters'
import {getFormatTime,getTokensByMarket} from "modules/formatter/common";
import {connect} from 'dva'
import {toBig, toNumber} from 'LoopringJS/common/formatter'
import intl from 'react-intl-universal'
import Worth from 'modules/settings/Worth'

const ListMarketFills = ({trades={},maxRows=5,dispatch})=>{
  // const maxHeight = (60*maxRows+32) + 'px'
  const market = trades.filters.market || 'LRC-WETH'
  const tokens = getTokensByMarket(market)
  const maxHeight = 'auto'
  const changePrice = (value) => {
    // Toast.info('Price has changed', 3, null, false);
    dispatch({
      type: 'placeOrder/priceChangeEffects',
      payload: {
        price: value
      }
    })
  }
  const changeAmount = (value) => {
    // Toast.info('Amount has changed', 3, null, false);
    dispatch({
      type: 'placeOrder/amountChange',
      payload: {
        amountInput: value
      }
    })
  }

  return (
    <div className="fs12 position-relative h-100 d-flex flex-column" style={{height:'100%'}}>
      <div className="row no-gutters ml0 mr0 w-100 bg-white" style={{position:'absolute',zIndex:1}}>
        <div style={{width:'40%'}} className="col-auto zb-b-b text-left pl15 pr5 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.price")} </div>
        <div style={{width:'30%'}} className="col-auto zb-b-b text-right pl5 pr5 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.amount")} {tokens.left}</div>
        <div hidden className="col-3 zb-b-b text-right pl5 pr5 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.LRCFee")} LRC</div>
        <div style={{width:'30%'}} className="col-auto zb-b-b text-right pl5 pr15 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.time")}</div>
      </div>
      <div className="text-number pt5 pb5 pt35 position-relative" style={{flex:1,overflow:'auto',zIndex:0}}>
        {
          trades.items && trades.items.map((item,index)=>{
            // const fillFm = new FillFm({...item,market})
            return (
              <div key={index} className="row no-gutters ml0 mr0">
                <div style={{width:'40%'}} className="col-auto border-none pl15 pr5 text-left align-middle cursor-pointer hover-default lh20" onClick={changePrice.bind(this,toNumber(item.price.toFixed(8)))}>
                  {
                    index%2 === 0 && <span className="color-error">{item.price.toFixed(8)}</span>
                  }
                  {
                    index%2 === 1 && <span className="color-success">{item.price.toFixed(8)}</span>
                  }
                </div>
                <div style={{width:'30%'}} className="col-auto border-none pl5 pr5 color-black-2 text-right align-middle text-nowrap cursor-pointer  hover-default lh20" onClick={changeAmount.bind(this,toNumber(item.amount.toFixed(4)))}>
                  {item.amount.toFixed(4)}
                </div>
                <div hidden className="col-auto border-none pl5 pr5 text-right color-black-2 align-middle text-nowrap lh20">
                  {item.lrcFee}
                </div>
                <div style={{width:'30%'}} className="col-auto border-none pl5 pr15 color-black-2 text-right align-middle text-nowrap lh20">
                  {getFormatTime(toNumber(item.createTime) * 1e3,'MM-DD HH:mm')}
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default connect(
  ({sockets:{trades}})=>({trades})
)(ListMarketFills)
