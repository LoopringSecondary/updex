import React from 'react';
import { connect } from 'dva';
import { Button,NavBar } from 'antd-mobile';
import { Icon } from 'antd';
import { toBig, toFixed, toNumber } from 'LoopringJS/common/formatter'
import Worth from 'modules/settings/Worth'
import intl from 'react-intl-universal'
import {calculateWorthInLegalCurrency} from "../modules/orders/formatters";

const HelperOfMarkets = (props)=>{
  const {p2pOrder, marketcap, dispatch} = props
  const {tokenS, tokenB} = p2pOrder

  const worthS = calculateWorthInLegalCurrency(marketcap.items, tokenS, 1)
  const worthB = calculateWorthInLegalCurrency(marketcap.items, tokenB, 1)

  const priceB = worthS && worthB && worthB.gt(0) ? toFixed(worthS.div(worthB), 8) : 0
  const priceS = worthS && worthB && worthS.gt(0) ? toFixed(worthB.div(worthS), 8) : 0

  return (
    <div className="bg-white" style={{}}>
  	  <table className="w-100 fs12">
  	    <thead>
  	      <tr className="">
  	        <th className="text-left zb-b-b pl15 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.token')}</th>
  	        <th className="text-left zb-b-b pl5 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.global_price')}</th>
  	        <th className="text-left zb-b-b pl5 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.exchange_ratio')}</th>
  	      </tr>
  	    </thead>
  	    <tbody>
            <tr>
              <td className="text-left pl15 pr5 pt10 pb10 zb-b-b color-black-2">
                {tokenS}
              </td>
              <td className="text-left pl5 pr5 pt10 pb10 zb-b-b color-black-2">
                <Worth amount={1} symbol={tokenS}/>
              </td>
              <td className="text-left pl5 pr5 pt10 pb10 zb-b-b color-black-2">
                {priceB} {tokenB}
              </td>
              
            </tr>
            <tr>
              <td className="text-left pl15 pr5 pt10 pb10 zb-b-b color-black-2">
                {tokenB}
              </td>
              <td className="text-left pl5 pr5 pt10 pb10 zb-b-b color-black-2">
                <Worth amount={1} symbol={tokenB}/>
              </td>
              <td className="text-left pl5 pr5 pt10 pb10 zb-b-b color-black-2">
                {priceS} {tokenS}
              </td>
            </tr>
  	    </tbody>
  	  </table>
    </div>
  )
}

export default connect(({
  p2pOrder,
  sockets
}) => ({
  p2pOrder:p2pOrder,
  marketcap:sockets.marketcap
}))(HelperOfMarkets)





