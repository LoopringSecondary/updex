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
import PanelWrapper from './PanelWrapper'

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
      <div style={{height:'100vh',overflow:'none' }} className="d-flex flex-column">
        <div className="d-flex flex-column mlpanel">
          <Header className="" />
        </div>
        <div className="row no-gutters" style={{flex:'1'}}>
          <div className="col d-flex flex-column" style={{flex:'1'}}>
            <PanelWrapper style={{flex:'1'}} className="mpanel mr0 mb0">
              <PanelHeader title="Kline Chart" />
              <Kline />
            </PanelWrapper>
          </div>
          <div className="col-auto d-flex flex-column mpanel mr0 mb0" style={{width:'40rem'}}>
            <PanelWrapper style={{flex:'1',paddingBottom:'0.7rem'}} className="">
              <PanelHeader title="Order Book" />
              <HelperOfDepth />
            </PanelWrapper>
            <PanelWrapper className="mtpanel pb5" style={{height:'365px'}}>
              <PanelHeader title="Place Order" />
              <div className="pt10"></div>
              <PlaceOrderForm location={location} match={match} />
            </PanelWrapper>
          </div>
          <div className="col-auto d-flex flex-column mpanel mr0 mb0" style={{width:'37.5rem'}}>
            <PanelWrapper style={{flex:'1',paddingBottom:'0.7rem'}} className="pb10">
              <PanelHeader title="Trade History" />
              <ListMarketFills />
            </PanelWrapper>
            <PanelWrapper className="mtpanel" style={{height:'365px'}}>
              <PanelHeader title="Orders" />
              <div style={{flex:'1',overflow:'auto'}}>
                <HelperOfMyMarketOrders />
              </div>
            </PanelWrapper>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Home)
