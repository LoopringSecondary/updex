import React from 'react';
import { connect } from 'dva';
import { Button,NavBar } from 'antd-mobile';
import { Icon } from 'antd';
import { toBig, toFixed, toNumber } from 'LoopringJS/common/formatter'
import Worth from 'modules/settings/Worth'
import intl from 'react-intl-universal'

const HelperOfPrice = (props)=>{
  const {p2pOrder, dispatch} = props
  const {amountB, amountS, tokenS, tokenB} = p2pOrder
  const price1 = amountB && amountS && toBig(amountS).gt(0) ? toFixed(toBig(amountB).div(amountS), 8) : 0
  const price2 = amountB && amountS && toBig(amountB).gt(0) ? toFixed(toBig(amountS).div(amountB), 8) : 0
  return (
    <div className="fs20 bg-white" style={{height:"100%",overflow:'auto' }}>
      <NavBar
        className="zb-b-b"
        mode="light"
        onLeftClick={() => dispatch({type:'layers/hideLayer',payload:{id:'helperOfPrice'}})}
        leftContent={[
          <span key='1' className="fs14"><Icon type="close"/></span>,
        ]}
      >
        <div className="color-black-1">{intl.get('helper_of_price.title')}</div>
      </NavBar>
      <div className="zb-b-b p15">
        <div className="fs14 color-black-1 mb5 text-left">
          {intl.get('common.sell')} {intl.get('common.price')}
          <span className="ml10">
            1 {tokenS} = {price1} {tokenB} ≈ <Worth amount={price1} symbol={tokenB}/>
          </span>
        </div>
        <div className="fs14 color-black-3 lh20 text-left">
          Global Price 
          <span className="ml10">
            1 {tokenS} ≈ <Worth amount={1} symbol={tokenS}/>
          </span>
        </div>
      </div>
      <div className="zb-b-b p10">
        <div className="fs14 color-black-1 mb5 text-left">
          {intl.get('common.buy')} {intl.get('common.price')}
          <span className="ml10">
            1 {tokenB} = {price2} {tokenS} ≈ <Worth amount={price2} symbol={tokenS}/>
          </span>
        </div>
        <div className="fs14 color-black-3 lh20 text-left">
            Global Price 
            <span className="ml10">
              1 {tokenB} ≈ <Worth amount={1} symbol={tokenB}/>
            </span>
        </div>
      </div>  

    </div>
  )
}
export default connect(({
  p2pOrder
}) => ({
  p2pOrder:p2pOrder
}))(HelperOfPrice)





