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
    const {match,location,dispatch} = this.props;
    const showLayer = (id)=>{
      dispatch({
        type:"layers/showLayer",
        payload:{id}
      })
    }
    return (
      <div className="row no-gutters ml0 mr0 bg-white align-items-stretch" style={{height:'100%'}}>
        <div className="col d-flex align-items-center text-left ">
          <TickerItem />
        </div>
        <div onClick={showLayer.bind(this,'help')} className="col-auto d-flex align-items-center zb-b-l pl25 pr25">
          <WebIcon type="question-circle" className="fs20 text-primary" />
        </div>
        <div onClick={showLayer.bind(this,'tasks')} className="col-auto d-flex align-items-center zb-b-l pl25 pr25">
          <i className="icon-bell fs20 text-primary"></i>
        </div>
        <div onClick={showLayer.bind(this,'settings')} className="col-auto d-flex align-items-center zb-b-l pl25 pr25">
          <i className="icon-cog fs20 text-primary"></i>
        </div>
        <div onClick={showLayer.bind(this,'usercenter')} className="col-auto d-flex align-items-center zb-b-l pl25 pr25">
          <i className="icon-user fs20 text-primary"></i>
        </div>
      </div>
    )
  }
}

export default connect()(Header)
