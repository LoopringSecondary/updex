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
    <div style={{height:maxHeight,overflow:'auto'}}>
      <table className="w-100 fs12" style={{overflow:'auto'}}>
        <thead>
          <tr className="">
            <th className="zb-b-b text-left pl15 pr5 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.price")} </th>
            <th className="zb-b-b text-right pl5 pr5 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.amount")} {tokens.left}</th>
            <th hidden className="zb-b-b text-right pl5 pr5 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.LRCFee")} LRC</th>
            <th className="zb-b-b text-right pl5 pr15 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.time")}</th>
          </tr>
        </thead>
        <tbody className="text-number">
            <tr className=""><td className="lh10 pt5" colSpan="10"></td></tr>
            {
              trades.items && trades.items.map((item,index)=>{
                // const fillFm = new FillFm({...item,market})
                return (
                  <tr key={index}>
                    <td className="border-none pl15 pr5 text-left align-middle"  style={{lineHeight:'1.8rem'}} onClick={changePrice.bind(this,toNumber(item.price.toFixed(8)))}>
                      {
                        index%2 === 0 && <span className="color-error">{item.price.toFixed(8)}</span>
                      }
                      {
                        index%2 === 1 && <span className="color-success">{item.price.toFixed(8)}</span>
                      }
                    </td>
                    <td className="border-none pl5 pr5 color-black-2 text-right align-middle text-nowrap"  style={{lineHeight:'1.8rem'}} onClick={changeAmount.bind(this,toNumber(item.amount.toFixed(4)))}>
                      {item.amount.toFixed(4)}
                    </td>
                    <td hidden className="border-none pl5 pr5 text-right color-black-2 align-middle text-nowrap"  style={{lineHeight:'1.8rem'}}>
                      {item.lrcFee}
                    </td>
                    <td className="border-none pl5 pr15 color-black-2 text-right align-middle text-nowrap"  style={{lineHeight:'1.8rem'}}>
                      {getFormatTime(toNumber(item.createTime) * 1e3,'MM-DD HH:mm')}
                    </td>
                  </tr>
                )
              })
            }
        </tbody>
      </table>
    </div>

  )
}

export default connect(
  ({sockets:{trades}})=>({trades})
)(ListMarketFills)
