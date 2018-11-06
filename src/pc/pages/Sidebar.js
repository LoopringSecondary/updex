import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import { Icon as WebIcon,Tooltip } from 'antd';
import PanelHeader from './PanelHeader'
import PanelWrapper from './PanelWrapper'
import intl from 'react-intl-universal'

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
      <div className="d-flex flex-column w-60" style={{height:'100vh',transition:'all 0s'}}>
          <div className="h-60 bg-white d-flex align-items-center justify-content-center" style={{flexGrow:'0'}}>
            <img className="h-40" src={require('../../assets/images/up-logo-notext-filled.png')} alt=""/>
            {!collapsed &&
              <div className="fs20 text-primary font-weight-bold ml10">
                UP DEX
              </div>
            }
          </div>
          <div className="d-flex flex-column mtpanel bg-white" style={{flex:'1'}}>
            <div className="">
              <Tooltip title="Market Trade" placement="right">
                <div className="pt15">
                  <div className="text-center cursor-pointer bg-primary m-auto circle-45 center-center">
                    <WebIcon type="line-chart" theme="" className="fs20 color-black" />
                  </div>
                  <div className="fs12 text-primary text-center mt5">{intl.get('pc_sidebar.market_trade')}</div>
                </div>
              </Tooltip>
              <Tooltip title="P2P Trade" placement="right">
                <div className="pt15">
                  <div onClick={()=>showLayer('p2p')} className="text-center cursor-pointer text-primary bg-primary-light hover-bg-primary m-auto circle-45 center-center">
                    <WebIcon type="team" theme="" className="fs20" />
                  </div>
                  <div className="fs12 text-primary text-center mt5">{intl.get('pc_sidebar.p2p_trade')}</div>
                </div>
              </Tooltip>
              <Tooltip title={intl.get('pc_panels.my_orders')} placement="right">
                <div className="pt15">
                  <div  className="text-center cursor-pointer text-primary bg-primary-light hover-bg-primary m-auto circle-45 center-center">
                    <WebIcon type="solution" theme="" className="fs20" />
                  </div>
                  <div className="fs12 text-primary text-center mt5">{intl.get('pc_sidebar.my_orders')}</div>
                </div>
              </Tooltip>
              <Tooltip title="My Wallet" placement="right">
                <div className="pt15">
                  <div  className="text-center cursor-pointer text-primary bg-primary-light hover-bg-primary m-auto circle-45 center-center">
                    <WebIcon type="property-safety" theme="" className="fs20" />
                  </div>
                  <div className="fs12 text-primary text-center mt5">{intl.get('pc_sidebar.my_wallet')}</div>
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
