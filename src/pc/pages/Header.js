import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import { Icon as WebIcon } from 'antd';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location,dispatch} = this.props;
    const showLayer = (id)=>{
      dispatch({
        type:"layers/showLayer",
        payload:{id}
      })
    }
    return (
      <div className="row no-gutters ml0 mr0 bg-white pb5 " style={{height:'100%'}}>
        <div className="col-auo d-flex align-items-center  pl20" style={{height:'100%',width:'22vw'}}>
          <img style={{height:'3.5vh'}} src={require('../../assets/images/up-logo-notext.png')} alt=""/> 
          <span className="text-primary ml10 fs20 font-weight-bold">UP DEX</span>
        </div>
        <div className="col" style={{height:'100%',width:'22vw'}}>
          
        </div>
        <div onClick={showLayer.bind(this,'help')} className="col-auto d-flex align-items-center zb-b-l pl30 pr30" style={{height:'100%'}}>
          <WebIcon type="question-circle" className="fs20 text-primary" />
        </div>
        <div onClick={showLayer.bind(this,'tasks')} className="col-auto d-flex align-items-center zb-b-l pl30 pr30" style={{height:'100%'}}>
          <i className="icon-bell fs20 text-primary"></i>
        </div>
        <div onClick={showLayer.bind(this,'settings')} className="col-auto d-flex align-items-center zb-b-l pl30 pr30" style={{height:'100%'}}>
          <i className="icon-cog fs20 text-primary"></i>
        </div>
        <div onClick={showLayer.bind(this,'usercenter')} className="col-auto d-flex align-items-center zb-b-l pl30 pr30" style={{height:'100%'}}>
          <i className="icon-user fs20 text-primary"></i>
        </div>
      </div>
    )
  }
}

export default connect()(Header)
