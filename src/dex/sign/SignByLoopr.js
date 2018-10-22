import React from 'react';
import intl from 'react-intl-universal'
import QRCode from 'qrcode.react';
import moment from 'moment'
import CountDown from 'LoopringUI/components/CountDown';
import storage from 'modules/storage'

const SignByLoopr = ({placeOrderSteps, dispatch}) => {
  
  return (
    <div className="">
      <NavBar
        className="bg-white"
        mode="light"
        leftContent={[
          <span onClick={()=>dispatch({type:'layers/hideLayer',payload:{id:'signByLoopr'}})} className="text-primary fs14 cursor-pointer" key="1"><Icon type="close" /></span>,
        ]}
        rightContent={[]}
      >
        <div className="color-black-1 fs16">
          Sgin With Loopr Wallet
        </div>
      </NavBar>
      <div className="p25 bg-fill">
        <div className="fs24">请使用Loopr Wallet完成交易签名</div>
      </div>
      <div className="p15 mt5 bg-fill lh25">
        <div className="pt10 pb10 text-left fs13 color-black-1" style={{margin:'0 auto'}}>
         1. 如果未安装 Loopr Wallet 
         1. 如果未完成签名，请
        </div>
      </div>
      <div className="p15 mt5 bg-fill lh25">
        <Button type="primary">继续签名</Button>
        <Button type="primary">完成签名</Button>
      </div>
    </div>
  )
}

export default SignByLoopr
