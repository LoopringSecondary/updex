import React from 'react'
import { NavBar, NoticeBar, Tabs } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import { Link, Redirect, Route, Switch } from 'dva/router'
import Containers from 'modules/containers'
import routeActions from 'common/utils/routeActions'
import { OpenOrderList, PullRefreshOrders } from 'mobile/orders/ListOrders'
import ListBalance from 'mobile/tokens/ListBalance'
import { getShortAddress } from '../../modules/formatter/common'
import storage from 'modules/storage'
import intl from 'react-intl-universal'
import {connect} from 'dva'

class UserCenter extends React.Component {
  render() {
    const {address} = this.props
    const logout = () => {
      const {dispatch} = this.props
      dispatch({type:"wallet/lock", payload:{}})
      dispatch({type:"layers/hideLayer", payload:{id:'usercenter'}})
      dispatch({type:"layers/showLayer", payload:{id:'auth2'}})
    }
    return (
        <div className="bg-fill" style={{height:'100%'}}>
          <div className="bg-white position-fixed w-100" style={{zIndex:'1000'}}>
            <NavBar
                className="zb-b-b" 
                mode="light"
                leftContent={[]}
                rightContent={[]}
            >
              <div className="text-center color-black">
                {intl.get('usercenter.page_title')}
              </div>
            </NavBar>
          </div>
          <div className="pt40 bg-white"></div>
          <div className="bg-white pt30 pb30 text-center">
            <div className="color-black-2 text-center fs16">{getShortAddress(address)}</div>
            <div className="color-black-2 text-center fs16" onClick={() => logout()}>Logout</div>
            <div className="text-center mt5">
              <span target="_blank" onClick={routeActions.gotoHref.bind(this,`https://etherscan.io/address/${address}`)} className="d-inline-block cursor-pointer fs12 lh25 pl10 pr10 bg-primary-light text-primary radius-circle">etherscan.io</span>
            </div>
          </div>
          <div className="bg-white"><div className="divider 1px zb-b-t "></div></div>
          <div className="height-auto tabs-no-border">
            <Tabs
              tabs={
                [
                  { title: <div className={`pt5 pb5 fs16 d-block w-100 text-center`}>{intl.get('user_center.my_assets')}</div> },
                  { title: <div className={`pt5 pb5 fs16 d-block w-100 text-center`}>{intl.get('user_center.my_orders')}</div> },
                  // { title: <div onClick={changeTab.bind(this,'fills')} className={`pt5 pb5 fs16 d-block w-100 text-center ${isActive('fills') ? 'text-primary' : 'color-black'}`}>{intl.get('user_center.my_fills')}</div> },
                ]
              }
              initialPage={0}
              swipeable={false}
              onChange={(tab, index) => { console.log('onChange', index, tab); }}
              onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
            >
              <div>
                <div className="divider 1px zb-b-b"></div>
                <ListBalance />
              </div>
              <div>
                <div className="divider 1px zb-b-b"></div>
                <Containers.Orders id="MyOpenOrders" alias="orders" initstate={{}}>
                  <PullRefreshOrders />
                </Containers.Orders>
              </div>
            </Tabs>
            <div className="pb50"></div>
          </div>
          <div className="pb50"></div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    address:state.wallet.address
  }
}
export default connect(mapStateToProps) (UserCenter)





