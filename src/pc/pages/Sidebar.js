import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import { Icon as WebIcon } from 'antd';
import ListTokens from '../tokens/ListTokens';
import MarketTitckers from '../tickers/ListMarketTickers';
import PanelHeader from './PanelHeader'
import PanelWrapper from './PanelWrapper'
class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location,dispatch,collapsed} = this.props;
    const showLayer = (id)=>{
      dispatch({
        type:"layers/showLayer",
        payload:{id}
      })
    }
    const collapsedWidth = collapsed ? '6rem' : '37.5rem'
    return (
      <div className="d-flex flex-column" style={{height:'100vh',width:collapsedWidth,transition:'all 0s'}}>
          <div className="bg-white d-flex align-items-center justify-content-center" style={{flexGrow:'0',height:'6rem'}}>
            <img style={{height:'4rem'}} src={require('../../assets/images/up-logo-notext.png')} alt=""/> 
            <span hidden={collapsed} className="text-primary ml10 fs20 font-weight-bold">UP DEX</span>
          </div>
          <div className="d-flex flex-column mtpanel" style={{flex:'1'}}>
            {!collapsed &&
              <PanelWrapper style={{flex:'1'}}>
                <PanelHeader title="Markets" />
                <div className="bg-white-light" style={{flex:'1',overflow:'auto'}}>
                  <MarketTitckers  />
                </div>
              </PanelWrapper>
            }
            {collapsed &&
              <div className="bg-white" style={{flex:1,overflow:'auto'}}>
                <ListTokens collapsed={collapsed} />
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
})(Sidebar)
