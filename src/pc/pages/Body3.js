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
import ListMarketFills from '../fills/ListMarketFills';
import HelperOfBalance from '../orders/HelperOfBalance';
import MarketTitckers from 'mobile/tickers/ListMarketTickers';
import Kline from 'mobile/charts/Kline';
import Header from './Header'
import PanelHeader from './PanelHeader'

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location,dispatch} = this.props;
    const showLayer = (id)=>{
      dispatch({
        type:"layers/showLayer",
        payload:{id}
      })
    }
    return (
      <div style={{height:'100vh',overflow:'none' }}>
        <div className="pl5 pr0" style={{height:'6.5rem',paddingTop:'0rem'}}>
         <Header />
        </div>
        <div className="row no-gutters ml0 mr0">
          <div className="col-auto p5 pr0 d-flex flex-column" style={{height:'94vh',width:'37.5rem'}}>
            <div className="bg-white position-relative d-flex flex-column" style={{flex:'1'}}>
              <PanelHeader title="Order Book" style={{position:'absolute',left:0,right:0,top:0}}/>
              <div className="zb-b-t mt45 pt5" style={{flex:1,overflow:'auto'}}>
                <HelperOfDepth />
              </div>
            </div>
            <div className="bg-white mt5" style={{flex:'none',height:'365px'}}>
              <PanelHeader title="Balances" />
              <div className="divider 1px zb-b-t"></div>
              <HelperOfBalance />
            </div>
          </div>
          <div className="col-auto p5 pr0 d-flex flex-column" style={{height:'94vh',width:'37.5rem'}}>
            <div className="bg-white pb5 position-relative d-flex flex-column" style={{flex:'1'}}>
              <PanelHeader title="Trade History" style={{position:'absolute',left:0,right:0,top:0}}/>
              <div className="zb-b-t mt45 pt5 pb5" style={{flex:1,overflow:'auto'}}>
                <ListMarketFills />
              </div>
            </div>
            <div className="bg-white mt5 position-relative d-flex flex-column" style={{flex:'none',height:'365px'}}>
              <PanelHeader title="Orders" style={{position:'absolute',left:0,right:0,top:0}}/>
              <div className="zb-b-t mt45 pt5 pb5" style={{flex:1,overflow:'auto'}}>
                <HelperOfMyMarketOrders />
              </div>
            </div>
          </div>
          <div className="col p5 pr0" style={{height:'94vh'}}>
            <div className="bg-white pb5" style={{overflow:'auto',height:'47vh'}}>
              <PanelHeader title="Kline Chart" />
              <div className="divider 1px zb-b-t"></div>
              <Kline height="" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Home)
