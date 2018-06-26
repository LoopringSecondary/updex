import React from 'react';
import { Button, Toast } from 'antd-mobile';
import { Icon as WebIcon } from 'antd';
import { connect } from 'dva';
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import {FillFm} from 'modules/fills/formatters'
import {getTokensByMarket} from 'modules/formatter/common'
import config from "common/config";
import {toNumber,toBig,toFixed} from "LoopringJS/common/formatter";
import TokenFm from "modules/tokens/TokenFm";

const HelperOfMyMarketFills = ({fills={},dispatch})=>{
  const market = fills.filters.market
  const tokens = getTokensByMarket(market)
  const changePrice = (item)=>{
    const tokenB = new TokenFm({symbol:item.tokenB});
    const tokenS = new TokenFm({symbol:item.tokenS});
    const market = config.getMarketByPair(item.market);
    const price = item.side.toLowerCase() === 'buy' ? tokenS.getUnitAmount(item.amountS).div(tokenB.getUnitAmount(item.amountB)) :
      tokenB.getUnitAmount(item.amountB).div(tokenS.getUnitAmount(item.amountS));
    Toast.info('Price has changed', 3, null, false);
    dispatch({
      type:'placeOrder/priceChangeEffects',
      payload:{
        price
      }
    })
  }
  const changeAmount = (item)=>{
    const fmS = item.side.toLowerCase() === 'buy' ? new TokenFm({symbol: item.tokenB}) : new TokenFm({symbol: item.tokenS});
    const amount = item.side.toLowerCase() === 'buy' ? fmS.getUnitAmount(item.amountB) : fmS.getUnitAmount(item.amountS);
    Toast.info('Amount has changed', 3, null, false);
    dispatch({
      type:'placeOrder/amountChange',
      payload:{
        amountInput:amount
      }
    })
  }
  const gotoDetail= (item)=>{
      dispatch({
        type:'layers/showLayer',
        payload:{
          id:'fillDetail',
          order:item,
        }
      })
  }
  const gotoAll = ()=>{
  }
  return (
    <div className="zb-b-t">
      <table className="w-100 fs13" style={{overflow:'auto'}}>
        <thead>
          <tr className="">
            <th className="zb-b-b bg-grey-100 text-left pl5 pr5 pt5 pb5 font-weight-normal color-black-3 ">Price</th>
            <th className="zb-b-b bg-grey-100 text-right pl5 pr5 pt5 pb5 font-weight-normal color-black-3 ">Amount</th>
            <th className="zb-b-b bg-grey-100 text-right pl5 pr5 pt5 pb5 font-weight-normal color-black-3 ">Fee</th>
            <th className="zb-b-b bg-grey-100 text-right pl5 pr5 pt5 pb5 font-weight-normal color-black-3 ">Time</th>
          </tr>
        </thead>
        <tbody>
            {
              fills.items && fills.items.map((item,index)=>{
                const fillFm = new FillFm(item)
                return (
                  <tr key={index}>
                    {
                      item.side === 'buy' &&
                      <td className="pl5 pr5 pt10 pb10 zb-b-b text-left align-middle color-green-500" onClick={changePrice.bind(this, item)}>
                        {fillFm.getPrice()}
                      </td>
                    }
                    {
                      item.side === 'sell' &&
                      <td className="pl5 pr5 pt10 pb10 zb-b-b text-left align-middle color-red-500" onClick={changePrice.bind(this, item)}>
                        {fillFm.getPrice()}
                      </td>
                    }
                    <td className="pl5 pr5 pt10 pb10 zb-b-b color-black-2 text-right align-middle text-nowrap" onClick={changeAmount.bind(this, item)}>
                      {fillFm.getAmount()}
                    </td>
                    <td className="pl5 pr5 pt10 pb10 zb-b-b text-right color-black-2 align-middle text-nowrap">
                      {fillFm.getLRCFee()}
                    </td>
                    <td className="pl5 pr5 pt10 pb10 zb-b-b color-black-2 text-right align-middle text-nowrap">
                      {fillFm.getCreateTime()}
                    </td>
                  </tr>
                )
              })
            }
            {
              fills.items && fills.items.length == 0 &&
              <tr>
                <td className="zb-b-b pt10 pb10 pl5 pr5 text-center color-black-3 fs12" colSpan='100'>
                  no {market} fills
                </td>
              </tr>
            }
        </tbody>
      </table>
      <div className="p10 mb15">
        <Button onClick={gotoAll} type="" size="small" style={{height:"36px",lineHeight:'36px'}}className="d-block w-100 fs14 bg-none">
          View all fills
        </Button>
      </div>
    </div>

  )
}

export default connect(({
  fills,
})=>({
 fills:fills.MyFills
}))(HelperOfMyMarketFills)
