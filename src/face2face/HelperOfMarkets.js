import React from 'react';
import { connect } from 'dva';
import { Button,NavBar } from 'antd-mobile';
import { Icon } from 'antd';
import { toBig, toFixed, toNumber } from 'LoopringJS/common/formatter'
import Worth from 'modules/settings/Worth'
import intl from 'react-intl-universal'

const HelperOfMarkets = (props)=>{
  const {p2pOrder, dispatch} = props
  const {amountB, amountS, tokenS, tokenB} = p2pOrder
  const priceSB = amountB && amountS && toBig(amountS).gt(0) ? toFixed(toBig(amountB).div(amountS), 8) : 0 // TODO
  const priceBS = amountB && amountS && toBig(amountB).gt(0) ? toFixed(toBig(amountS).div(amountB), 8) : 0 // TODO
  return (
    <div className="bg-white" style={{}}>
  	  <table className="w-100 fs12">
  	    <thead>
  	      <tr className="">
  	        <th className="text-left zb-b-b pl15 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.token')}</th>
  	        <th className="text-left zb-b-b pl5 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.price')}</th>
  	        <th className="text-left zb-b-b pl5 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.exchange')}</th>
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
                {priceSB} {tokenB}
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
                {priceBS} {tokenS}
              </td>
            </tr>
  	    </tbody>
  	  </table>
    </div>
  )
}

export default connect(({
  p2pOrder
}) => ({
  p2pOrder:p2pOrder
}))(HelperOfMarkets)





