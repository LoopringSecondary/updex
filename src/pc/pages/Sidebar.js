import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import { Icon as WebIcon } from 'antd';
import ListTokens from '../tokens/ListTokens';
import MarketTitckers from 'mobile/tickers/ListMarketTickers';
import PanelHeader from './PanelHeader'
import PanelWrapper from './PanelWrapper'
class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location,dispatch,sidebar} = this.props;
    const showLayer = (id)=>{
      dispatch({
        type:"layers/showLayer",
        payload:{id}
      })
    }
    
    const collapsed = sidebar && !sidebar.visible
    const collapsedWidth = collapsed ? '6.5rem' : '37.5rem'
    return (
      <div className="d-flex flex-column" style={{height:'100vh',width:collapsedWidth,transition:'all 0.3s'}}>
          <div className="bg-white-light d-flex align-items-center justify-content-center" style={{flexGrow:'0',height:'6.5rem'}}>
            <img style={{height:'4rem'}} src={require('../../assets/images/up-logo-notext.png')} alt=""/> 
            <span hidden={collapsed} className="text-primary ml10 fs20 font-weight-bold">UP DEX</span>
          </div>
          <div className="mt5 d-flex flex-column" style={{flex:'1'}}>
            <PanelWrapper style={{flex:'1'}}>
              <PanelHeader title="Markets" />
              <div className="bg-white" style={{flex:'1',overflow:'auto'}}>
                {false && <ListTokens collapsed={collapsed}/>}
                { !collapsed && <MarketTitckers  />}
              </div>
            </PanelWrapper>
            {
              false &&
              <PanelWrapper className="mt5">
                <PanelHeader title="My Wallet" />
              </PanelWrapper>  
            }
          </div>
      </div>
    )
  }
}

export default connect(({layers})=>{
  return {
    sidebar:layers && layers.SidebarOfMarkets
  }
})(Sidebar)
