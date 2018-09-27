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
import Body3 from './Body3'
import Sidebar2 from './Sidebar2'

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
    const showLayer = (id)=>{
      dispatch({
        type:"layers/showLayer",
        payload:{id}
      })
    }
    return (
      <div style={{height:'100vh',overflow:'none' }}>
        <div className="row no-gutters ml0 mr0">
          <div className="col-auto" style={{height:'100vh'}}>
            <Sidebar2 />
          </div>
          <div className="col p5 pr0 pl0 pt0" style={{height:'100vh'}}>
            <Body3 location={location} match={match} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Home)
