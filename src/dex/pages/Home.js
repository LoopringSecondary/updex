import React from 'react'
import {Redirect, Route, Switch } from 'dva/router'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import { NavBar } from 'antd-mobile'
import { Icon } from 'antd'
import UserCenter from '../account/UserCenter'
import Markets from '../tickers/Markets'
import PlaceOrder from '../orders/PlaceOrderForm'
import LayoutDexHome from '../../layout/LayoutDexHome'

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location} = this.props;
    return (
      <LayoutDexHome {...this.props}>
      <div style={{ }}>
         <NavBar
           className=""
           mode="light"
           onLeftClick={() => {}}
           leftContent={null && [
             <span className="color-black-1"><Icon key="1" type="left" /></span>,
           ]}
           rightContent={[
             <span className="text-primary" onClick={()=>{}}><Icon key="1" type="scan" /></span>
           ]}
         >
         Home
         </NavBar>
         <div className="pt45 pb45">
            <div className="row no-gutters bg-white">
              <div className="col-12">
                <div className="text-left p10 zb-b-b">
                  <div className="fs16 color-black-1">Trade</div>
                </div>
              </div>
              <div className="col-6">
                <div className="text-left pl10 pr10 pt15 pb15">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="circle-40 center-center bg-rimary-light text-primary"><Icon type="line-chart" /></div>
                    </div>
                    <div className="col">
                      <div className="fs14 color-black-1">Markrt Trade</div>
                      <div className="fs11">Public trade with everyone </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 zb-b-l">
                <div className="text-left pl10 pr10 pt15 pb15">
                  <div className="fs14 color-black-1">P2P Trade</div>
                  <div className="fs11">Privacy trade with friends</div>
                </div>
              </div>
            </div>
         </div>
         
      </div>
      </LayoutDexHome>
    )
  }
}

export default Home
