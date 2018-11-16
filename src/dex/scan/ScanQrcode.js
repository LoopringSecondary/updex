import React from 'react'
import {Redirect, Route, Switch } from 'dva/router'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import { NavBar,Button } from 'antd-mobile'
import { Icon,Spin } from 'antd'
import UserCenter from '../account/UserCenter'
import Markets from '../tickers/Markets'
import PlaceOrder from '../orders/PlaceOrderForm'

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {} = this.props;
    return (
      <div style={{ }}>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={() => {}}
          leftContent={null && [
            <span key="1" className="text-primary"><Icon  type="home" /></span>,
          ]}
          rightContent={null && [
            <span  key="1" className="text-primary" onClick={()=>{}}><Icon type="scan" /></span>
          ]}
        >
          <div className="color-black-1 fs16">LoopringDEX</div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
         <div className="pt25 zb-b-b text-center bg-white">
           <img className="circle-50" src={require('../../assets/images/loopr.png')} alt=""/>
           <div className="fs20 color-black-1 mt15">路印扫码交易</div>
           <div className="fs12 color-black-2 mt5">一个钱包在手，轻易扫码多个去中心化交易所</div>
           <div className="row no-gutters bg-white align-items-center">
             <div className="col">
               <div className="text-center pl5 pr5 pt15 pb15 zb-b-b">
                <div className="circle-35 center-center m-auto bg-primary-light text-primary fs16"><Icon type="user" /></div>
                <div className="fs13 color-black-2 mt10">扫码登录</div>
                <div hidden className="fs11 color-black-3 ">签名</div>
               </div>
             </div>
             <div className="col">
               <div className="text-center pl5 pr5 pt15 pb15 zb-b-b">
                <div className="circle-35 center-center m-auto bg-primary-light text-primary fs16"><Icon type="safety" /></div>
                <div className="fs13 color-black-2 mt10">扫码签名</div>
                <div hidden className="fs11 color-black-3 ">P2P</div>
               </div>
             </div>
             <div className="col">
               <div className="text-center pl5 pr5 pt15 pb15 zb-b-b">
                <div className="circle-35 center-center m-auto bg-primary-light text-primary fs16"><Icon type="audit" /></div>
                <div className="fs13 color-black-2 mt10">扫码下单</div>
                <div hidden className="fs11 color-black-3 ">签名</div>
               </div>
             </div>
             <div className="col">
               <div className="text-center pl5 pr5 pt15 pb15 zb-b-b">
                <div className="circle-35 center-center m-auto bg-primary-light text-primary fs16"><Icon type="deployment-unit" /></div>
                <div className="fs13 color-black-2 mt10">扫码吃单</div>
                <div hidden className="fs11 color-black-3 ">P2P</div>
               </div>
             </div>
             <div className="col">
               <div className="text-center pl5 pr5 pt15 pb15 zb-b-b">
                <div className="circle-35 center-center m-auto bg-primary-light text-primary fs16"><Icon type="experiment" /></div>
                <div className="fs13 color-black-2 mt10">更多</div>
                <div hidden className="fs11 color-black-3 ">P2P</div>
               </div>
             </div>
           </div>
           <div className="p15">
            <Button type="primary" className=""><Icon type="scan" className="mr5" />扫码</Button>
            <Button onClick={routeActions.gotoPath.bind(this,'/dex/home')} type="default" className="bg-primary-light text-primary border-none mt15"><Icon type="home" className="mr5" />返回</Button>
           </div>
         </div>
         <div className="p15">
           <div className="color-black-3 fs12 lh20">
            1. 可以对任何支持路印协议的去中心化交易所进行扫码交易。目前支持 UP DEX,Circulr DEX等
           </div>
         </div>
      </div>
    )
  }
}

export default Home
