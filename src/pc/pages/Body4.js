import React from 'react';
import {connect} from 'dva'
import intl from 'react-intl-universal';
import Markets from '../tickers/Markets';
import PlaceOrderForm from '../orders/PlaceOrderForm';
import HelperOfDepth from '../orders/HelperOfDepth';
import HelperOfMyMarketOrders from 'mobile/orders/HelperOfMyMarketOrders';
import ListMarketFills from '../fills/ListMarketFills';
import HelperOfBalance from '../orders/HelperOfBalance';
import Kline from 'mobile/charts/Kline';
import Header from './Header'
import PanelHeader from './PanelHeader'
import PanelWrapper from './PanelWrapper'


class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location} = this.props;
    return (
      <div style={{height:'100vh',overflow:'none' }} className="d-flex flex-column">
        <div className="d-flex flex-column mlpanel">
          <Header className="" />
        </div>
        <div className="row no-gutters" style={{flex:'1'}}>
          <div className="col d-flex flex-column" style={{flex:'1'}}>
            <PanelWrapper style={{flex:'1'}} className="mpanel mr0 mb0">
              {/*<PanelHeader title="Kline Chart" />*/}
              <Kline />
            </PanelWrapper>
            <PanelWrapper className="mpanel mr0 mb0" style={{height:'36.5rem'}}>
              <PanelHeader title={intl.get('user_center.my_orders')} />
              <div style={{flex:'1',overflow:'auto'}}>
                <HelperOfMyMarketOrders />
              </div>
            </PanelWrapper>
          </div>
          <div className="col-auto d-flex flex-column mpanel mr0 mb0" style={{width:'375px'}}>
            <PanelWrapper style={{flex:'1',paddingBottom:'0.7rem'}} className="">
              <PanelHeader title={intl.get('common.order_book')} />
              <HelperOfDepth />
            </PanelWrapper>
            <PanelWrapper className="mtpanel pb5" style={{height:'36.5rem'}}>
              {/*<PanelHeader title="Place Order" />*/}
              <div className="pt10"></div>
              <PlaceOrderForm location={location} match={match} />
            </PanelWrapper>
          </div>
          <div className="col-auto d-flex flex-column" style={{width:'350px'}}>
            <PanelWrapper style={{flex:'1',paddingBottom:'0.7rem'}} className="pb10 mlpanel mtpanel">
              <PanelHeader title={intl.get('fill_list.trade_history')} />
              <ListMarketFills />
            </PanelWrapper>
            <PanelWrapper className="mtpanel mlpanel" style={{height:'36.5rem'}}>
              <PanelHeader title={intl.get('place_order.assets')} />
              <HelperOfBalance />
            </PanelWrapper>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
