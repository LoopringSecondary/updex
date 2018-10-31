import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import { Icon as WebIcon,Tooltip } from 'antd';
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
            <div className="zb-b-b">
              <Tooltip title="Market Trade" placement="right">
                <div className="pt15 pb15 text-center cursor-pointer zb-b-t text-primary bg-primary-light">
                  <WebIcon type="sliders" theme="" className="fs20" />
                  <div hidden className="fs12">Trade</div>
                </div>
              </Tooltip>
              <Tooltip title="P2P Exchange" placement="right">
                <div className="pt15 pb15 text-center cursor-pointer zb-b-t text-primary">
                  <WebIcon type="swap" theme="" className="fs20" />
                  <div hidden className="fs12">P2P</div>
                </div>
              </Tooltip>
              <Tooltip title="My Orders" placement="right">
                <div className="pt15 pb15 text-center cursor-pointer zb-b-t text-primary">
                  <WebIcon type="profile" theme="" className="fs20" />
                  <div hidden className="fs12">Orders</div>
                </div>
              </Tooltip>
              <Tooltip title="My Wallet" placement="right">
                <div className="pt15 pb15 text-center cursor-pointer zb-b-t text-primary">
                  <WebIcon type="wallet" theme="" className="fs20" />
                  <div hidden className="fs12">Wallet</div>
                </div>
              </Tooltip>
            </div>
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
