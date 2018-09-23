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
      <div className="d-flex flex-column" style={{height:'100vh',width:'6.5rem'}}>
          <div className="text-center bg-white d-flex align-items-center justify-content-center" style={{flexGrow:'0',height:'6.5rem'}}>
            <img style={{height:'4rem'}} src={require('../../assets/images/up-logo-notext.png')} alt=""/> 
            <span hidden className="text-primary ml10 fs20 font-weight-bold">UP DEX</span>
          </div>
          <div className="" style={{flex:'1',overflow:'hidden'}}>
            <div className="bg-white mt5">
              <ListTokens />
            </div>
          </div>

      </div>
    )
  }
}

export default connect()(Header)
