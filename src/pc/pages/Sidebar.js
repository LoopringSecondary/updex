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
    const collapsedWidth = collapsed ? '6rem' : '35rem'
    return (
      <div className="d-flex flex-column" style={{height:'100vh',width:collapsedWidth,transition:'all 0s'}}>
          <div className="bg-white d-flex align-items-center justify-content-center" style={{flexGrow:'0',height:'6rem'}}>
            <img style={{height:'4rem'}} src={require('../../assets/images/up-logo-notext.png')} alt=""/>
            
            {!collapsed &&
              <div className="fs20 text-primary font-weight-bold ml10">
                UP DEX
              </div>
            }
          </div>
          <div className="d-flex flex-column mtpanel bg-white" style={{flex:'1'}}>
            {!collapsed &&
              <div className="" style={{flex:'1',overflow:'auto'}}>
                <MarketTitckers  />
              </div>
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
