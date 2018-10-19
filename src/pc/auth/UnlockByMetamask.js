import React from 'react'
import { Button, NavBar, Modal,List,InputItem,Toast } from 'antd-mobile'
import {unlockWithMetaMask} from 'common/utils/unlock'
import { connect } from 'dva'
import { Icon, Collapse, Steps, Modal as AntdModal } from 'antd'
import storage from 'modules/storage'
import uuidv4 from 'uuid/v4'
import intl from 'react-intl-universal'
import moment from 'moment'
import Notification from 'LoopringUI/components/Notification'

const dpath = "m/44'/60'/0'";

class Auth extends React.Component {
  state={
    address:'',
    metamaskState:''
  }

  checkMetaMaskState() {
    let state = ''
    if(window.web3){
      if(!window.web3.eth.accounts[0]) { // locked
        state = 'locked'
        this.setState({metamaskState:state})
      }
    } else { // to install
      state = 'notInstalled'
      this.setState({metamaskState:state})
    }
    return state
  }

  componentDidMount() {
    this.checkMetaMaskState()
  }

  showLayer = (payload = {}) => {
    const {dispatch} = this.props
    dispatch({
      type: 'layers/showLayer',
      payload: {
        ...payload
      }
    })
  }

  hideLayer = (payload = {}) => {
    const {dispatch} = this.props
    dispatch({
      type:"layers/hideLayer",
      payload:{
        ...payload
      }
    })
  }

  render () {
    const {uuid,item, scanAddress, metaMask, placeOrderSteps, dispatch} = this.props
    const {address} = this.state;

    const chromeExtention = {
      'Opera' : "https://addons.opera.com/extensions/details/metamask/",
      'Chrome' : "https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn",
      'Firefox' : "https://addons.mozilla.org/firefox/addon/ether-metamask/"
    }
    let browserType = '', browserSupported = false
    var u = navigator.userAgent, app = navigator.appVersion;
    if(u.indexOf('OPR') > -1) {
      browserType = 'Opera'
      browserSupported = true
    } else if (u.indexOf('Chrome') > -1) {
      browserType = 'Chrome'
      browserSupported = true
    } else if(u.indexOf('Firefox') > -1) {
      browserType = 'Firefox'
      browserSupported = true
    } else {
      browserType = 'Others'
    }

    const openToRefresh = () => {
      const state = this.checkMetaMaskState()
      if(state === 'notInstalled') {
        if(browserType !== 'Others') {
          window.open(chromeExtention[browserType])
        }
      }
      dispatch({type: 'metaMask/setRefreshModalVisible', payload: {refreshModalVisible:true}});
    }

    return (
      <div className="bg-white" style={{height:'100vh',overflow:'auto'}}>
        <NavBar
          className="bg-white"
          mode="light"
          leftContent={[
            <span onClick={()=>this.hideLayer({id:'unlockByMetaMask'})} className="text-primary fs14 cursor-pointer" key="1"><Icon type="close" /></span>,
          ]}
          rightContent={[]}
        >
          <div className="color-black-1 fs16">
            {intl.get('unlock_by_metaMask.title')}
          </div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
        {(!browserType || browserType === 'Others' || (browserSupported && this.state.metamaskState === 'notInstalled')) &&
        <div className="bg-fill p15 lh25 color-black-1 m15 fs13 mt40">
          	<div className="">{intl.get('wallet.title_connect',{walletType:'MetaMask'})}</div>
            <div>
              {!browserType || browserType === 'Others' &&
              <div className="btn btn-primary btn-block btn-xxlg">{intl.get('wallet_meta.browser_tip')}</div>
              }
              {browserSupported && this.state.metamaskState === 'locked' &&
              <Button className="btn btn-primary btn-block btn-xxlg" size="large" onClick={openToRefresh}>{intl.get('wallet_meta.unlock_metaMask_tip')}</Button>
              }
              {browserSupported && this.state.metamaskState === 'notInstalled' &&
              <Button className="btn btn-primary btn-block btn-xxlg" size="large" onClick={openToRefresh}>{intl.get('wallet_meta.install_metaMask_tip')}</Button>
              }
              {browserSupported && !this.state.metamaskState &&
              <Button className="btn btn-primary btn-block btn-xxlg" onClick={this.connectToMetamask} size="large"> {intl.get('unlock.actions_connect',{walletType:'MetaMask'})}</Button>
              }
            </div>
            {
              browserType && browserType !== 'Others' &&
              <div>
                <a href={chromeExtention[browserType]} target="_blank">
                  <i className="icon-export"/> {intl.get('wallet_meta.actions_get_metaMask',{browser:browserType})}
                </a>
              </div>
            }
            <div><a className="text-primary" href="https://metamask.io/" target="_blank">{intl.get('wallet_meta.actions_visit_metaMask')}</a></div>
        </div>
        }

      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
  }
}

export default connect(mapStateToProps)(Auth)
