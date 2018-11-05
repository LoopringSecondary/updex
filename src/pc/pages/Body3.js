import React from 'react';
import {connect} from 'dva'
import intl from 'react-intl-universal';
import Markets from '../tickers/Markets';
import PlaceOrderFormNoSide from '../orders/PlaceOrderFormNoSide';
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
      <div style={{height:'100vh',overflow:'none'}} className="d-flex flex-column">
        <div className="d-flex flex-column mlpanel">
          <Header className="" />
        </div>
        <div className="row no-gutters" style={{flex:'1'}}>
          <div className="col d-flex flex-column" style={{flex:'1'}}>
            <PanelWrapper style={{flex:'1'}} className="mpanel mr0 mb0">
              <PanelHeader title="Kline Chart" />
              <Kline />
            </PanelWrapper>
            <div className="row no-gutters ml0 mr0 mtpanel" style={{height:'320px'}}>
              <div className="col-6" style={{height:'100%'}}>
                <PanelWrapper className="mlpanel" style={{flex:'1',height:'100%'}}>
                  <PanelHeader title="My Orders" />
                  <div style={{flex:'1',overflow:'auto'}}>
                    <HelperOfMyMarketOrders />
                  </div>
                </PanelWrapper>
              </div>
              <div className="col-6" style={{height:'100%'}}>
                <PanelWrapper className="mlpanel" style={{flex:'1',height:'100%'}}>
                  <PanelHeader title="My Wallet" />
                  <div style={{flex:'1',overflow:'auto'}}>
                    <HelperOfBalance />
                  </div>
                </PanelWrapper>
              </div>
            </div>
          </div>
          <div className="col-auto d-flex flex-column mlpanel mtpanel">
            <div className="row no-gutters ml0 mr0" style={{flex:'1'}}>
              <div className="col-auto" style={{height:'100%'}}>
                <PanelWrapper style={{height:'100%',paddingBottom:'0.7rem',width:'25rem'}} className="">
                  <PanelHeader title="Order Book" />
                  <HelperOfDepth />
                </PanelWrapper>
              </div>
              <div className="col-auto" style={{height:'100%'}}>
                <PanelWrapper style={{height:'100%',paddingBottom:'0.5rem',width:'25rem'}} className="mlpanel">
                  <PanelHeader title="Trade History" />
                  <ListMarketFills />
                </PanelWrapper>
              </div>
            </div>
            <PanelWrapper className="mtpanel" style={{height:'320px'}}>
              <PanelHeader title="Place Order" />
              <div className="row no-gutters ml0 mr0 mtpanel">
                <div className="col-auto" style={{width:'25rem'}}>
                  <PlaceOrderFormNoSide side="buy" location={location} match={match} />
                </div>
                <div className="col-6" style={{width:'25rem'}}>
                  <PlaceOrderFormNoSide side="sell" location={location} match={match} />
                </div>
              </div>
            </PanelWrapper>
          </div>
        </div>
      </div>
    )
  }
}
export default Home
