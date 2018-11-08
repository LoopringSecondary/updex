import React from 'react'
import { Link, Redirect, Route, Switch } from 'dva/router'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import { TabBar } from 'antd-mobile'
import { Icon } from 'antd'
import { connect } from 'dva'
import { toBig } from 'LoopringJS/common/formatter'
import { getBalanceBySymbol } from '../modules/tokens/TokenFm'

class DexHomeLayout extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {balance, txs, allocates} = this.props
    const url = routeActions.match.getUrl(this.props)
    const pathname = routeActions.location.getPathname(this.props)
    const changeTab = (path) => {
      routeActions.gotoPath(`/dex/${path}`)
    }
    const isActive = (path) => {
      return pathname.indexOf(path) > -1
    }
    return (
      <div style={{}}>
        {this.props.children}
        <div className="tabbar-only-bar">
          <TabBar
            style={{position: 'fixed', bottom: 0, left: 0, right: 0}}
            className="position-fixed"
          >
            <TabBar.Item
              title={
                <span className={isActive('/dex/home') ? 'text-primary' : ''}>Home{intl.get('common.home')}</span>
              }
              key="home"
              icon={
                <i className="icon-home color-primary-light-bak"></i>
              }
              selectedIcon={
                <i className="icon-home text-primary"></i>
              }
              selected={isActive('/dex/home')}
              onPress={() => {
                changeTab('home')
              }}
            />
            <TabBar.Item
              title={
                <span className={isActive('/dex/markets') ? 'text-primary' : ''}>{intl.get('common.markets')}</span>
              }
              key="markets"
              icon={
                <i className="icon-market color-primary-light-bak"></i>
              }
              selectedIcon={
                <i className="icon-market text-primary"></i>
              }
              selected={isActive('/dex/markets')}
              onPress={() => {
                changeTab('markets')
              }}
            />
            <TabBar.Item
              icon={<i className="icon-trade-m color-primary-light-bak"/>}
              selectedIcon={<i className="icon-trade-m text-primary"/>}
              title={<span
                className={isActive('/dex/placeOrder') ? 'text-primary' : ''}>{intl.get('common.trade')}</span>}
              key="placeOrder"
              selected={isActive('/dex/placeOrder')}
              onPress={() => {
                changeTab('placeOrder')
              }}
            />
            <TabBar.Item
              icon={<i className="icon-user color-primary-light-bak"/>}
              selectedIcon={<i className="icon-user text-primary"/>}
              title={
                <span
                  className={isActive('/dex/usercenter') ? 'text-primary' : ''}>{intl.get('user_center.tab_title')}</span>
              }
              key="usercenter"
              selected={isActive('/dex/usercenter')}
              onPress={() => {
                changeTab('usercenter')
              }}
            />
          </TabBar>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    balance: state.sockets.balance,
    txs: state.sockets.pendingTx.items,
    allocates: state.sockets.orderAllocateChange.items,
  }
}

export default connect(mapStateToProps)(DexHomeLayout)


