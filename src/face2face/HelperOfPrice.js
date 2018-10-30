import React from 'react';
import { connect } from 'dva';
import { Button,NavBar } from 'antd-mobile';
import { Icon } from 'antd';

const HelperOfPrice = (props)=>{
  const {p2pOrder, dispatch} = props
  const {amountB, amountS, tokenS, tokenB} = p2pOrder

  console.log(1111, amountB, amountS, tokenS, tokenB)
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
        <div className="color-black-1">Price Helper</div>
      </NavBar>
      <div className="zb-b-b p15">
        <div className="fs14 color-black-2 mb5 text-left">卖出{tokenS}价格</div>
        <div className="fs12 color-black-3 lh20 text-left">
          1 {tokenS} ≈ xxxx {tokenB} ≈ $1.0
        </div>
      </div>
      <div className="zb-b-b p10">
        <div className="fs14 color-black-2 mb5 text-left">买入{tokenB}价格</div>
        <div className="fs12 color-black-3 lh20 text-left">
          1 WETH ≈ xxxx LRC ≈ $200.0
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





