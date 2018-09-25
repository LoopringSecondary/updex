import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal';
import { TabBar,NavBar,Icon,Tabs } from 'antd-mobile';
import { Icon as WebIcon } from 'antd';
import UserCenter from '../account/UserCenter';
import Markets from '../tickers/Markets';
import PlaceOrderForm from '../orders/PlaceOrderForm';
import PlaceOrder from 'mobile/orders/PlaceOrderPage';
import HelperOfDepth from '../orders/HelperOfDepth';
import HelperOfMyMarketOrders from 'mobile/orders/HelperOfMyMarketOrders';
import HelperOfBalance from 'mobile/orders/HelperOfBalance';
import MarketTitckers from 'mobile/tickers/ListMarketTickers';
import Header from './Header';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location,dispatch} = this.props;
    const {url} = match;
    const {pathname} = location;
    const changeTab = (path) => {
      routeActions.gotoPath(`${url}/${path}`);
    }
    return (
      <div style={{height:'100vh',overflow:'none' }}>
        <div className="" style={{height:'6vh'}}>
          <Header />
        </div>
        <div className="row no-gutters ml0 mr0">
          <div className="col p5 pr0" style={{height:'94vh'}}>
            <div className="bg-white pb5" style={{overflow:'auto',height:'47vh'}}>
              <NavBar
                className="bg-white"
                mode="light"
                onLeftClick={() => routeActions.goBack()}
                leftContent={null && [
                  <span className="color-black-1"><WebIcon key="1" type="left" /></span>,
                ]}
                rightContent={null && [
                  <span className="color-black-1 " onClick={()=>{}}><WebIcon key="1" type="info-circle-o" /></span>
                ]}
              >
                <div className="color-black">Kline Charts</div>
              </NavBar>
              <div className="divider 1px zb-b-t"></div>
              <MarketTitckers />
            </div>
          </div>
          <div className="col-auto p5 pr0" style={{height:'94vh',width:'20vw'}}>
            <div className="bg-white" style={{overflow:'auto',height:'60vh'}}>
              <NavBar
                className="bg-white"
                mode="light"
                onLeftClick={() => routeActions.goBack()}
                leftContent={null && [
                  <span className="color-black-1"><WebIcon key="1" type="left" /></span>,
                ]}
                rightContent={null && [
                  <span className="color-black-1 " onClick={()=>{}}><WebIcon key="1" type="info-circle-o" /></span>
                ]}
              >
                <div className="color-black">OrderBook</div>
              </NavBar>
              <div className="divider 1px zb-b-t"></div>
              <HelperOfDepth />
            </div>
            <div className="bg-white mt5" style={{overflow:'auto',height:'34vh'}}>
              <NavBar
                className="bg-white"
                mode="light"
                onLeftClick={() => routeActions.goBack()}
                leftContent={null && [
                  <span className="color-black-1"><WebIcon key="1" type="left" /></span>,
                ]}
                rightContent={null && [
                  <span className="color-black-1 " onClick={()=>{}}><WebIcon key="1" type="info-circle-o" /></span>
                ]}
              >
                <div className="color-black">Trade History</div>
              </NavBar>
              <div className="divider 1px zb-b-t"></div>
              <HelperOfDepth />
            </div>
            
          </div>
          <div className="col-auto p5" style={{height:'94vh',width:'20vw'}}>
            <div className="bg-white" style={{overflow:'auto',height:'60vh'}}>
              <NavBar
                className="bg-white"
                mode="light"
                onLeftClick={() => routeActions.goBack()}
                leftContent={null && [
                  <span className="color-black-1"><WebIcon key="1" type="left" /></span>,
                ]}
                rightContent={null && [
                  <span className="color-black-1 " onClick={()=>{}}><WebIcon key="1" type="info-circle-o" /></span>
                ]}
              >
                <div className="color-black">Place Order</div>
              </NavBar>
              <div className="divider 1px zb-b-t"></div>
              <div className="pt10 pb10">
                <PlaceOrderForm location={location} match={match} />
              </div>
              <div className="pl20 pr20">
                <HelperOfBalance />
              </div>
            </div>
            <div className="bg-white mt5" style={{overflow:'auto',height:'34vh'}}>
              <Tabs
                tabs={
                  [
                    { title: <div className="am-tabs-item-bak-wrapper"><div className="fs16 am-tabs-item-bak">{intl.get('place_order.assets')}</div></div>, tab:'assets' },
                    { title: <div className="am-tabs-item-bak-wrapper"><div className="fs16 am-tabs-item-bak">{intl.get('place_order.orders')}</div></div>, tab:'orders' },
                  ]
                }
                initialPage={0}
                swipeable={false}
                onChange={(tab, index) => {}}
                onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
              >
                <div className="">
                  <div className="divider 1px zb-b-t"></div>
                  <HelperOfBalance />
                </div>
                <div className="">
                  <div className="divider 1px zb-b-t"></div>
                  <HelperOfMyMarketOrders />
                </div>
              </Tabs>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default connect()(Home)
