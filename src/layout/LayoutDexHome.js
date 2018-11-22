import React from 'react'
import { Link, Redirect, Route, Switch } from 'dva/router'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import { TabBar } from 'antd-mobile'
import { Icon } from 'antd'
import { connect } from 'dva'
import { toBig } from 'LoopringJS/common/formatter'
import { getBalanceBySymbol } from '../modules/tokens/TokenFm'
import storage from 'modules/storage'

class DexHomeLayout extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {} = this.props
    const url = routeActions.match.getUrl(this.props)
    const pathname = routeActions.location.getPathname(this.props)
    const isActive = (path) => {
      return pathname.indexOf(path) > -1
    }
    const {dispatch} = this.props
    const address =  storage.wallet.getUnlockedAddress()
    const showLayer = (payload = {}) => {
      dispatch({
        type: 'layers/showLayer',
        payload: {...payload}
      })
    }
    const changeTab = (path) => {
      if( path === 'usercenter'){
        if(address && address !== 'undefined' &&  address !== 'null'){
          routeActions.gotoPath(`/dex/${path}`)
        }else {
          console.log('changeTab usercenter')
          showLayer({id:'authOfMobile'})
        }
      }else{
        routeActions.gotoPath(`/dex/${path}`)
      }
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
                <span className={isActive('/dex/home') ? 'text-primary' : ''}>{intl.get('common.home')}</span>
              }
              key="home"
              icon={
                <Icon type="appstore" theme="filled" className="color-primary-light-bak" />
              }
              selectedIcon={
                <Icon type="appstore" theme="filled" className="text-primary" />
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
                <Icon type="sliders" theme="filled" className="color-primary-light-bak" />
              }
              selectedIcon={
                <Icon type="sliders" theme="filled" className="text-primary" />
              }
              selected={isActive('/dex/markets')}
              onPress={() => {
                changeTab('markets')
              }}
            />
            <TabBar.Item
              icon={
                <Icon type="interation" theme="filled" className="color-primary-light-bak" />
              }
              selectedIcon={
                <Icon type="interation" theme="filled" className="text-primary" />
              }
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
  }
}

export default connect()(DexHomeLayout)


