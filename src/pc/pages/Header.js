import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import { Icon as WebIcon } from 'antd';
import TickerItem from '../tickers/TickerItem';
class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location,dispatch,className} = this.props;
    const showLayer = (id)=>{
      dispatch({
        type:"layers/showLayer",
        payload:{id}
      })
    }
    const clickUser = ()=>{
      const unlocked = true
      if(unlocked){
        showLayer('usercenter')
      }else{
        showLayer('auth2')
      }
    }
    return (
      <div className={`bg-white row no-gutters d-flex align-items-stretch ${className}`} style={{height:'100%'}}>
        <div className="col d-flex align-items-center text-left ">
          <TickerItem />
        </div>
        <div onClick={showLayer.bind(this,'help')} className="col-auto d-flex align-items-center zb-b-l pl25 pr25">
          <WebIcon type="question-circle" theme="filled" className="fs20 text-primary" />
        </div>
        <div onClick={showLayer.bind(this,'tasks')} className="col-auto d-flex align-items-center zb-b-l pl25 pr25">
          <i className="icon-bell fs20 text-primary"></i>
        </div>
        <div onClick={showLayer.bind(this,'settings')} className="col-auto d-flex align-items-center zb-b-l pl25 pr25">
          <i className="icon-cog fs20 text-primary"></i>
        </div>
        <div onClick={clickUser} className="col-auto d-flex align-items-center zb-b-l pl25 pr25">
          <i className="icon-user fs20 text-primary"></i>
        </div>
      </div>
    )
  }
}

export default connect()(Header)
