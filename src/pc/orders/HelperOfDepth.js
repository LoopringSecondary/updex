import React from 'react';
import { Spin,Icon as WebIcon } from 'antd';
import { NoticeBar,Icon } from 'antd-mobile';
import { connect } from 'dva';
import intl from 'react-intl-universal'
import { Toast } from 'antd-mobile';
import Worth from 'modules/settings/Worth'
import { getTokensByMarket } from 'modules/formatter/common'

const HelperOfDepth = ({depth={},pair,maxRows=15,dispatch})=>{
  const tokens = getTokensByMarket(pair)
  const sell = depth.item && depth.item.sell ? [...depth.item.sell].reverse() : []
  const changePrice = (value)=>{
    // Toast.info('Price has changed', 3, null, false);
    dispatch({
      type:'placeOrder/priceChangeEffects',
      payload:{
        price:value
      }
    })
  }
  const changeAmount = (value)=>{
    // Toast.info('Amount has changed', 3, null, false);
    dispatch({
      type:'placeOrder/amountChange',
      payload:{
        amountInput:value
      }
    })
  }
  return (
    <div className="d-flex flex-column" style={{height:'100%'}}>
      <div className="" style={{flex:1,overflow:'auto'}}>
          <table className="w-100 fs12">
            <thead>
              <tr className="">
                <th className="zb-b-b text-left pl15 pr5 pt5 pb5 text-nowrap font-weight-normal color-black-4">{intl.get("common.price")}</th>
                <th className="zb-b-b text-right pl5 pr5 pt5 pb5 text-nowrap font-weight-normal color-black-4">{intl.get("common.amount")}/{tokens.left}</th>
                <th className="zb-b-b text-right pl5 pr15 pt5 pb5 text-nowrap font-weight-normal color-black-4">{intl.get("common.total")}/{tokens.right}</th>
              </tr>
            </thead>
              <tbody>
                  <tr className=""><td className="lh10 pt5" colSpan="10"></td></tr>
                  {
                    sell && sell.map((item,index)=>
                      <tr key={index}>
                        <td className="hover-default pl15 pr5 lh20 text-left color-error align-top" onClick={changePrice.bind(this, Number(item[0]).toFixed(8))}>
                          {Number(item[0]).toFixed(8)}
                          <span className="fs12 color-black-4 ml5"><Worth amount={Number(item[0]).toFixed(8)} symbol={tokens.right}/></span>
                        </td>
                        <td className="hover-default pl5 pr5 lh20 color-black-2 text-right align-top" onClick={changeAmount.bind(this, Number(item[1]).toFixed(4))}>
                          {Number(item[1]).toFixed(4)}
                        </td>
                        <td className="hover-default pl5 pr15 lh20 color-black-2 text-right align-top" onClick={changeAmount.bind(this, Number(item[1]).toFixed(4))}>
                          {Number(item[2]).toFixed(4)}
                        </td>
                      </tr>
                    )
                  }
                  {
                    depth.item && depth.item.sell && depth.item.sell.length === 0 &&
                      <tr className="">
                        <td colSpan="10" className="p10 text-center align-top color-black-4 fs12">
                          {intl.get('common.list.no_data_custom',{title:intl.get('common.depth')})}
                        </td>
                      </tr>
                  }
                  <tr className=""><td className="lh10 pt5" colSpan="10"></td></tr>
              </tbody>
          </table>
      </div>
      <div className="zb-b-t">
        <div className="text-left pl15 pr15 pt10 pb10 zb-b-b">
          <span className="color-error fs16">0.00044278</span>
          <span className="color-black-4 fs12 ml10">≈ $0.88</span>
        </div>
      </div>
      <div className="" style={{flex:"1",overflow:'auto'}}>
          <table className="w-100 fs13">
            <tbody className="">
                <tr className=""><td className="lh10 pt5" colSpan="10"></td></tr>
                {
                  depth.item && depth.item.buy && depth.item.buy.map((item,index)=>
                    <tr key={index} >
                      <td className="hover-default pl15 pr5 lh20 text-left color-success align-top" onClick={changePrice.bind(this, Number(item[0]).toFixed(8))}>
                        {Number(item[0]).toFixed(8)}
                        <span className="fs12 color-black-4 ml5"><Worth amount={Number(item[0]).toFixed(8)} symbol={tokens.right}/></span>
                      </td>
                      <td className="hover-default pl5 pr5 lh20 color-black-2 text-right align-top" onClick={changeAmount.bind(this, Number(item[1]).toFixed(4))}>
                        {Number(item[1]).toFixed(4)}
                      </td>
                      <td className="hover-default pl5 pr15 lh20 color-black-2 text-right align-top" onClick={changeAmount.bind(this, Number(item[1]).toFixed(4))}>
                        {Number(item[2]).toFixed(4)}
                      </td>
                    </tr>
                  )
                }
                {
                  depth.item && depth.item.buy && depth.item.buy.length === 0 &&
                    <tr>
                      <td colSpan="10" className="p10 text-center align-top color-black-4 fs12">
                        {intl.get('common.list.no_data_custom',{title:intl.get('common.depth')})}
                      </td>
                    </tr>
                }
                <tr className=""><td className="lh10 pt5" colSpan="10"></td></tr>
            </tbody>
          </table>
      </div>
    </div>
    
  )
}

export default connect(
  ({sockets:{depth}, placeOrder:{pair}})=>({depth, pair})
)(HelperOfDepth)


