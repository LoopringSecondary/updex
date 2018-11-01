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
            <img style={{height:'4rem'}} src={require('../../assets/images/up-logo-notext-filled.png')} alt=""/>
            {!collapsed &&
              <div className="fs20 text-primary font-weight-bold ml10">
                UP DEX
              </div>
            }
          </div>
          <div className="d-flex flex-column mtpanel bg-white" style={{flex:'1'}}>
            <div className="zb-b-b">
              <Tooltip title="Market Trade" placement="right">
                <div className="pt10 pb10 zb-b-t">
                  <div className="text-center cursor-pointer bg-primary circle m-auto" style={{height:'4.2rem',width:'4.2rem',lineHeight:'5rem'}}>
                    <WebIcon type="line-chart" theme="" className="fs20 color-black" />
                  </div>
                </div>
              </Tooltip>
              <Tooltip title="P2P Trade" placement="right">
                <div className="pt10 pb10 zb-b-t">
                  <div onClick={()=>showLayer('p2p')} className="text-center cursor-pointer text-primary bg-primary-light hover-bg-primary circle m-auto" style={{height:'4.2rem',width:'4.2rem',lineHeight:'5rem'}}>
                    <WebIcon type="team" theme="" className="fs20" />
                  </div>
                </div>
              </Tooltip>
              <Tooltip title="My Orders" placement="right">
                <div className="pt10 pb10 zb-b-t">
                  <div  className="text-center cursor-pointer text-primary bg-primary-light hover-bg-primary circle m-auto" style={{height:'4.2rem',width:'4.2rem',lineHeight:'5rem'}}>
                    <WebIcon type="solution" theme="" className="fs20" />
                  </div>
                </div>
              </Tooltip>
              <Tooltip title="My Wallet" placement="right">
                <div className="pt10 pb10 zb-b-t">
                  <div  className="text-center cursor-pointer text-primary bg-primary-light hover-bg-primary circle m-auto" style={{height:'4.2rem',width:'4.2rem',lineHeight:'5rem'}}>
                    <WebIcon type="property-safety" theme="" className="fs20" />
                  </div>
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
