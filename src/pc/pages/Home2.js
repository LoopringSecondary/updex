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
import Body2 from './Body2'
import Sidebar from './Sidebar'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarCollapsed:false,
    }
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
    const toggleSidebar = ()=>{
      this.setState({
        sidebarCollapsed:!this.state.sidebarCollapsed
      })
    }
    return (
      <div className="" style={{height:'100vh',overflow:'none' }}>
        <div className="row no-gutters ml0 mr0">
          <div className="col-auto" style={{height:'100vh'}}>
            <Sidebar collapsed={this.state.sidebarCollapsed} toggleSidebar={toggleSidebar}/>
          </div>
          <div className="col" style={{height:'100vh'}}>
            <Body2 location={location} match={match} collapsed={this.state.sidebarCollapsed} toggleSidebar={toggleSidebar} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Home)
