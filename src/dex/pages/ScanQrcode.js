import React from 'react'
import {Redirect, Route, Switch } from 'dva/router'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import { NavBar } from 'antd-mobile'
import { Icon } from 'antd'
import UserCenter from '../account/UserCenter'
import Markets from '../tickers/Markets'
import PlaceOrder from '../orders/PlaceOrderForm'

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location} = this.props;
    const {url} = match;
    const {pathname} = location;
    const changeTab = (path) => {
      routeActions.gotoPath(`${url}/${path}`);
    }
    return (
      <div style={{ }}>
         <NavBar
           className=""
           mode="light"
           onLeftClick={() => {}}
           leftContent={null && [
             <span className="color-black-1"><Icon key="1" type="left" /></span>,
           ]}
           rightContent={null && [
             <span className="color-black-1 " onClick={()=>{}}><Icon key="1" type="info-circle-o" /></span>
           ]}
         >
         Home
         </NavBar>
      </div>
    )
  }
}

export default Home
