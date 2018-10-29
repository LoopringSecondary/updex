import React from 'react';
import { connect } from 'dva';
import { Button,NavBar } from 'antd-mobile';
import { Icon } from 'antd';

const HelperOfPrice = (props)=>{
  const {dispatch} = props
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
        <div className="fs14 color-black-2 mb5 text-left">卖出LRC价格</div>
        <div className="fs12 color-black-3 lh20 text-left">
          1 LRC ≈ xxxx WETH ≈ $1.0
        </div>
      </div>
      <div className="zb-b-b p10">
        <div className="fs14 color-black-2 mb5 text-left">买入WETH价格</div>
        <div className="fs12 color-black-3 lh20 text-left">
          1 WETH ≈ xxxx LRC ≈ $200.0
        </div>
      </div>  
    </div>
  )
}
export default connect()(HelperOfPrice)





