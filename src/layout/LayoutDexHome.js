import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal';
import { TabBar,NavBar,Icon } from 'antd-mobile';
import { Icon as WebIcon } from 'antd';

class DexHomeLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const url = routeActions.match.getUrl(this.props)
    const pathname = routeActions.location.getPathname(this.props)
    const changeTab = (path) => {
      routeActions.gotoPath(`/dex/${path}`);
    }
    return (
      <div style={{}}>
        {this.props.children}
        <div className="tabbar-only-bar">
          <TabBar
            style={{position:"fixed",bottom: 0,left:0,right:0}}
            className="position-fixed"
          >
            <TabBar.Item
              title={intl.get("common.markets")}
              key="markets"
              icon={
                <WebIcon type="line-chart" className="fs22" style={{marginTop:'0px'}} />
              }
              selectedIcon={
                <WebIcon type="line-chart" className="fs22" style={{marginTop:'0px'}} />
              }
              selected={pathname === `/dex/markets`}
              onPress={() => {
                changeTab('markets')
              }}
            />
            <TabBar.Item
              icon={<WebIcon type="pay-circle-o" className="fs22" style={{marginTop:'0px'}} />}
              selectedIcon={<WebIcon type="pay-circle-o" className="fs22" style={{marginTop:'0px'}} />}
              title={intl.get("common.trade")}
              key="placeOrder"
              selected={pathname.indexOf(`/dex/placeOrder`)>-1}
              onPress={() => {
                changeTab('placeOrder')
              }}
            />
            <TabBar.Item
              badge="6"
              icon={<WebIcon type="bell" className="fs22" style={{marginTop:'0px'}} />}
              selectedIcon={<WebIcon type="bell" className="fs22" style={{marginTop:'0px'}} />}
              title={intl.get('todos.tab_title')}
              key="Notifications"
              selected={pathname === `/dex/todos`}
              onPress={() => {
                changeTab('todos')
              }}
            />
            <TabBar.Item
              icon={<WebIcon type="user" className="fs22" style={{marginTop:'0px'}} />}
              selectedIcon={<WebIcon type="user" className="fs22" style={{marginTop:'0px'}} />}
              title={intl.get("user_center.tab_title")}
              key="userCenter"
              selected={pathname === `/dex/userCenter`}
              onPress={() => {
                changeTab('userCenter')
              }}
            />
          </TabBar>
        </div>
      </div>
    )
  }
}

export default DexHomeLayout
