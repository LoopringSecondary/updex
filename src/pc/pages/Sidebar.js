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
      <div className="bg-white" style={{height:'100%',width:'100%'}}>
          <div className="text-center pt10 pb10" style={{height:'6rem',background:"rgba(0,0,0,0.13)"}}>
            <img style={{height:'4rem'}} src={require('../../assets/images/up-logo-notext.png')} alt=""/> 
            <span hidden className="text-primary ml10 fs20 font-weight-bold">UP DEX</span>
          </div>
      </div>
    )
  }
}

export default connect()(Header)
