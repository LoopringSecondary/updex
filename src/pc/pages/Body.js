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
    const {match,location,collapsed} = this.props;
    return (
      <div style={{height:'100vh',overflow:'none'}}  className="d-flex flex-column">
        <div className="mlpanel" style={{paddingTop:'0rem'}}>
         <Header className="" />
        </div>
        <div className="row no-gutters ml0 mr0" style={{flex:'1'}}>
          <div className="col-auo d-flex flex-column mpanel mr0 mb0" style={{width:'25rem'}}>
            <PanelWrapper className="pb5">
              <PanelHeader title={intl.get('pc_panels.place_order')} />
              <div className="pt5"></div>
              <PlaceOrderForm location={location} match={match} />
            </PanelWrapper>
            <PanelWrapper className="mtpanel">
              <PanelHeader title={intl.get('pc_panels.my_wallet')} />
              <HelperOfBalance />
            </PanelWrapper>
            <PanelWrapper className="mtpanel" style={{flex:'1'}}>
              <PanelHeader title={intl.get('pc_panels.my_orders')} />
              <div style={{flex:'1',overflow:'auto'}}>
                <HelperOfMyMarketOrders />
              </div>
            </PanelWrapper>
          </div>
          <div className="col-auto mpanel mr0 mb0 d-flex flex-column" style={{width:'22.5rem'}}>
            <PanelWrapper style={{flex:'1'}}>
              <PanelHeader title={intl.get('pc_panels.order_book')}  />
              <HelperOfDepth />
            </PanelWrapper>
            { false && !collapsed &&
              <div className="mtpanel">
                <PanelWrapper style={{height:'40vh'}}>
                  <PanelHeader title={intl.get('pc_panels.trade_history')} />
                  <ListMarketFills />
                </PanelWrapper>
              </div>
            }
          </div>
          <div className="col mpanel mr0 mb0 d-flex flex-column" style={{}}>
            <PanelWrapper style={{flex:'1'}}>
              <PanelHeader title={intl.get('pc_panels.charts')} />
              <Kline />
            </PanelWrapper>
          </div>
          { collapsed &&
            <div className="col-auto mpanel mr0 mb0  d-flex flex-column"  style={{width:'20rem'}}>
              <PanelWrapper style={{flex:'1'}}>
                <PanelHeader title={intl.get('fill_list.trade_history')} />
                <ListMarketFills />
              </PanelWrapper>
            </div>
          }

        </div>
      </div>
    )
  }
}

export default connect(({layers})=>{
  let collapsed
  if(layers.SidebarOfMarkets){
    collapsed = !layers.SidebarOfMarkets.visible
  }else{
    collapsed = true // default value
  }
  return {
    collapsed
  }
})(Home)
