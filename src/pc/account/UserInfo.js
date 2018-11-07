import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import { Icon as WebIcon } from 'antd';
import storage from 'modules/storage'
import { getShortAddress } from '../../modules/formatter/common'

class UserInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {dispatch,className,address,unlockType} = this.props;
    const showLayer = (id)=>{
      dispatch({
        type:"layers/showLayer",
        payload:{id}
      })
    }
    const clickUser = ()=>{
      if(address){
        showLayer('usercenter')
      }else{
        showLayer('authOfPC')
      }
    }
    let icon,title;
    if(unlockType){
      switch (unlockType) {
        case 'address':
          icon = <i className="icon-eye fs20"></i>
          title = "Watch-Only Wallet"
          break;
        case 'metaMask':
          icon = <i className="icon-Metamaskwallet fs20"></i>
          title = "MetaMask"
          break;
        case 'ledger':
          icon = <i className="icon-ledgerwallet fs20"></i>
          title = "Ledger"
          break;
        case 'loopr':
          icon = <i className="icon-loopr fs20"></i>
          title = "Loopr Wallet"
          break;
        case 'upWallet':
          icon = <img style={{height: '24px'}} src={require('../../assets/images/up-logo-notext.png')} alt=""/>
          title = "UP Wallet"
          break;
        default:
          break;
      }
    }
    return (
      <div onClick={clickUser} className="cursor-pointer hover-default" style={{height:'100%'}}>
        {
          !address &&
          <div className="pl25 pr25 d-flex align-items-center" style={{height:'100%'}}>
            <WebIcon type="user" className="fs20 text-primary" />
          </div>
        }
        {
          !!address &&
          <div className="row no-gutters ml0 mr0 align-items-center pl25 pr25" style={{height:'100%'}}>
            <div className="col-auto pr10 text-primary">
              {icon}
            </div>
            <div className="col">
              <div className="fs12 text-primary">{getShortAddress(address)}</div>
              <div className="fs12 text-primary lh15">{title}</div>
            </div>
          </div>
        }
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    address:state.wallet.address,
    unlockType:state.wallet.unlockType
  }
}
export default connect(mapStateToProps)(UserInfo)

