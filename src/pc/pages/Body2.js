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
          </div>
          <div className="col-auto d-flex flex-column mlpanel mtpanel">
            <div className="row no-gutters ml0 mr0" style={{flex:'1'}}>
              <div className="col-auto" style={{height:'100%'}}>
                <PanelWrapper style={{height:'100%',paddingBottom:'0.7rem',width:'35rem'}} className="">
                  <PanelHeader title="Order Book" />
                  <HelperOfDepth />
                </PanelWrapper>
              </div>
              <div className="col-auto" style={{height:'100%'}}>
                <PanelWrapper style={{height:'100%',paddingBottom:'0.5rem',width:'35rem'}} className="mlpanel">
                  <PanelHeader title="Trade History" />
                  <ListMarketFills />
                </PanelWrapper>
              </div>
            </div>
            <div className="row no-gutters ml0 mr0 mtpanel">
              <div className="col-auto">
                <PanelWrapper style={{flex:'1',paddingBottom:'0.7rem',height:'36.5rem '}} className="">
                  <PanelHeader title="Buy LRC" />
                  <div className="pt10"></div>
                  <PlaceOrderFormNoSide side="buy" location={location} match={match} />
                </PanelWrapper>
              </div>
              <div className="col-auto">
                <PanelWrapper className="" style={{height:'36.5rem'}}>
                  <PanelHeader title="Sell LRC" />
                  <div className="pt10"></div>
                  <PlaceOrderFormNoSide side="sell" location={location} match={match} />
                </PanelWrapper>
              </div>
            </div>
            {
              false &&
              <PanelWrapper className="mtpanel" style={{height:'36.5rem'}}>
                <PanelHeader title="Orders" />
                <div style={{flex:'1',overflow:'auto'}}>
                  <HelperOfMyMarketOrders />
                </div>
              </PanelWrapper>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Home
