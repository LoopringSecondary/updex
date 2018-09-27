import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import { Icon as WebIcon } from 'antd';
import ListTokens from '../tokens/ListTokens';
import MarketTitckers from '../tickers/ListMarketTickers';
import PlaceOrderForm from '../orders/PlaceOrderForm';
import PanelHeader from './PanelHeader'
class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      collapsed:false,
      defaultCollapsed:true,
    }
  }
  render(){
    const {match,location,dispatch} = this.props;
    const showLayer = (id)=>{
      dispatch({
        type:"layers/showLayer",
        payload:{id}
      })
    }
    
    const collapsed = this.state.collapsed
    const collapsedWidth = collapsed ? '6.5rem' : '42rem'
    return (
      <div className="d-flex flex-column" style={{height:'100vh',width:collapsedWidth,transition:'all 0.3s'}}>
          <div className="bg-white-light d-flex align-items-center justify-content-center" style={{flexGrow:'0',height:'6.5rem'}}>
            <img style={{height:'4rem'}} src={require('../../assets/images/up-logo-notext.png')} alt=""/> 
            <span hidden={collapsed} className="text-primary ml10 fs20 font-weight-bold">UP DEX</span>
          </div>
          <div className="bg-white-light mt5 d-flex flex-column" style={{flex:'1'}}>
            <div style={{flex:'1',overflow:'auto'}}>
              {false && <ListTokens collapsed={collapsed}/>}
              {true && <MarketTitckers  />}
            </div>
          </div>
          <div className="bg-white mt5" style={{flex:'none',overflow:'auto',height:'365px'}}>
            <PanelHeader title="Place Order" />
            <div className="divider 1px zb-b-t"></div>
            <div className="pt5 pb5">
              <PlaceOrderForm location={location} match={match} />
            </div>
          </div>

      </div>
    )
  }
}

export default connect()(Sidebar)
