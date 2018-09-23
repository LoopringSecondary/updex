import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import { Icon as WebIcon } from 'antd';
import ListTokens from '../tokens/ListTokens';

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
      <div className="" style={{height:'100%',width:'32rem'}}>
          <div className="text-center pt10 pb10 bg-white d-flex align-items-center justify-content-center" style={{height:'6.5rem',background:"rgba(0,0,0,0.15)"}}>
            <img style={{height:'4rem'}} src={require('../../assets/images/up-logo-notext.png')} alt=""/> 
            <span hidden className="text-primary ml10 fs20 font-weight-bold">UP DEX</span>
          </div>
          <div className="text-center bg-white mt5" style={{height:'90vh',background:"rgba(0,0,0,0.15)"}}>
            <ListTokens />
          </div>

      </div>
    )
  }
}

export default connect()(Header)
