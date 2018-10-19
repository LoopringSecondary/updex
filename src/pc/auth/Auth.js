import React from 'react'
import { Button, NavBar, Modal,List,InputItem,Toast } from 'antd-mobile'
import UserAgent from 'common/utils/useragent'
import {unlockWithMetaMask} from 'common/utils/unlock'
import { connect } from 'dva'
import { Icon, Steps, Modal as AntdModal } from 'antd'
import storage from 'modules/storage'
import uuidv4 from 'uuid/v4'
import intl from 'react-intl-universal'
import {getXPubKey as getLedgerPublicKey, connect as connectLedger} from "LoopringJS/ethereum/ledger";

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

  authByThirdPartyWallet = (wallet) => {
    const ua = new UserAgent()
    if(ua.isWechat()){
      Modal.alert('Open Wallet in Safari','Please click top-right corner button')
    }else{
      const {dispatch} = this.props
      const uuid = uuidv4().substring(0, 8)
      dispatch({
        type: 'sockets/extraChange',
        payload: {id: 'addressUnlock', extra: {uuid}}
      })
      dispatch({type:'sockets/fetch',payload:{id:'addressUnlock'}});
      const data = {type: 'UUID', value: uuid}
      window.location = `${wallet}://${JSON.stringify(data)}`
    }
  }

  authByAddress = () => {
    const {address} = this.state;
    const re = new RegExp("^0x[0-9a-fA-F]{40}$")
    if(address && re.test(address)){
      storage.wallet.storeUnlockedAddress('address', address)
      window.RELAY.account.register(address)
      // routeActions.gotoPath('/pc/trade/lrc-weth')
      this.props.dispatch({type:'wallet/unlockAddressWallet',payload:{address}});
      this.props.dispatch({
        type: 'sockets/extraChange',
        payload: {id: 'addressUnlock', extra: {uuid:""}}
      })
      this.props.dispatch({
        type: 'layers/hideLayer',
        payload: {id: 'authOfPC'}
      })
      this.props.dispatch({type: 'sockets/unlocked'});
      Modal.alert(intl.get('notifications.title.log_in_suc'))
    }else{
      Toast.fail(intl.get("notifications.title.invalid_address_tip"))
    }
  }

  amountChange = (value) => {
    this.setState({address:value})
  }

  loopringUnlock = () => {
    const {dispatch} = this.props;
    const uuid = uuidv4()
    dispatch({type: 'scanAddress/uuidChanged', payload: {UUID: uuid.substring(0, 8)}})
    dispatch({
      type: 'sockets/extraChange',
      payload: {id: 'addressUnlock', extra: {UUID: uuid.substring(0, 8)}}
    });
    dispatch({type: 'sockets/fetch', payload: {id: 'addressUnlock'}});
  }

  unlockByLoopr = () => {
    storage.wallet.setLoopringUnlockWith('loopr')
    this.loopringUnlock()
    this.showLayer({id:'unlockByLoopr'})
  };

  unlockByUpWallet = () => {
    storage.wallet.setLoopringUnlockWith('upWallet')
    this.loopringUnlock()
    this.showLayer({id:'unlockByLoopr'})
  };

  connectToMetamask = () => {
    this.checkMetaMaskState()
    const {dispatch} = this.props
    dispatch({type: 'metaMask/setLoading', payload: {loading:true}});
    unlockWithMetaMask(dispatch)
  }

  unlockByLedger = () =>{
    connectLedger().then(res => {
      if (!res.error) {
        const ledger = res.result;
        getLedgerPublicKey(dpath, ledger).then(resp => {
          if (!resp.error) {
            const {chainCode, publicKey} = resp.result;
            this.props.dispatch({
              type: "determineWallet/setHardwareWallet",
              payload: {chainCode, publicKey, dpath, walletType: 'ledger'}
            });
            this.props.dispatch({
              type: 'layers/showLayer',
              payload: {id: 'unlockByLedger', chooseAddress: this.chooseAddress}
            });
          }
        });
      }
    });
  }

  chooseAddress = (path)=>{
    connectLedger().then(res => {
      if (!res.error) {
        const ledger = res.result;
        getLedgerPublicKey(path, ledger).then(resp => {
          if (!resp.error) {
            const {address} = resp.result;
            window.RELAY.account.register(address)
            // routeActions.gotoPath('/pc/trade/lrc-weth')
            this.props.dispatch({type:'wallet/unlockLedgerWallet',payload:{ledger, dpath:path, address}});
            this.props.dispatch({
              type: 'layers/hideLayer',
              payload: {id: 'authOfPC'}
            })
            this.props.dispatch({type: 'sockets/unlocked'});
          }
        });
      }
    });
  }

  render () {
    const {metaMask, placeOrderSteps, dispatch} = this.props
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

    const hideModal = () => {
      dispatch({type: 'metaMask/setRefreshModalVisible', payload: {refreshModalVisible:false}});
    }

    const refresh = () => {
      if (window.web3 && window.web3.eth.accounts[0]) {
        this.connectToMetamask()
      } else {
        window.location.reload()
      }
    }

    const unlockTypeChanged = (unlockType) => {
      switch(unlockType) {
        case 'loopr':
          this.unlockByLoopr();
          break;
        case 'upWallet':
          this.unlockByUpWallet();
          break;
        case 'metaMask':
          const state = this.checkMetaMaskState()
          if(!browserType || browserType === 'Others' || (browserSupported && state === 'notInstalled')) {
            this.showLayer({id:'unlockByMetaMask'})
          } else {
            if(browserSupported && (state === 'locked' || state === 'notInstalled')) {
              openToRefresh()
            } else {
              this.connectToMetamask()
            }
          }
          break;
      }
    }

    const _this = this
    return (
      <div className="bg-white" style={{height:'100vh',overflow:'auto'}}>
        <NavBar
          className="bg-white"
          mode="light"
          leftContent={[
            <span onClick={()=>_this.hideLayer({id:'authOfPC'})} className="text-primary fs14 cursor-pointer" key="1"><Icon type="close" /></span>,
          ]}
          rightContent={[]}
        >
          <div className="color-black-1 fs16">
            Unlock  Wallet
          </div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
        <div className="pl15 pr15">
          <div className="text-center pt50 pb30">
            <img style={{height:'5rem'}} src={require('../../assets/images/up-logo-notext.png')} alt=""/>
            <div className="text-primary fs20 font-weight-bold mt5 mb5">UP DEX</div>
          </div>
        </div>
        <div className="">
          <div onClick={()=>unlockTypeChanged('upWallet')} className="row m15 p15 no-gutters align-items-center bg-primary"
               style={{padding: '7px 0px',borderRadius:'50em'}}>
            <div className="col-auto text-left pl15 " style={{width:'6rem'}}>
              <img style={{height: '30px'}} src={require('../../assets/images/up-logo-notext-white.png')} alt=""/>
            </div>
            <div className="col text-left">
              <div className="fs16 color-black-1 text-left">UP Wallet</div>
            </div>
            <div className="col-auto text-right">
              <div className="fs14 text-wrap text-left">
                <span className="fs13 color-black-2 mr5">Unlock</span>
                <Icon className="color-black-2" type="right"/>
              </div>
            </div>
          </div>
          <div onClick={()=>unlockTypeChanged('loopr')} className="row m15 p15 no-gutters align-items-center bg-primary" style={{padding: '7px 0px',borderRadius:'50em'}}>
            <div className="col-auto text-left pl15 " style={{width:'6rem'}}>
              <i className="icon-loopr color-black-1 fs28"></i>
            </div>
            <div className="col text-left">
              <div className="fs16 color-black-1 text-left">Loopr Wallet</div>
            </div>
            <div className="col-auto text-right">
              <div className="fs14 text-wrap text-left">
                <span className="fs13 color-black-2 mr5">Unlock</span>
                <Icon className="color-black-2" type="right"/>
              </div>
            </div>
          </div>
          <div onClick={()=>unlockTypeChanged('metaMask')} className="row m15 p15 no-gutters align-items-center bg-primary"
               style={{padding: '7px 0px',borderRadius:'50em'}}>
            <AntdModal
              title={intl.get('wallet_meta.unlock_steps_title')}
              visible={metaMask.refreshModalVisible}
              maskClosable={false}
              onOk={refresh}
              onCancel={hideModal}
              okText={null}
              cancelText={null}
              footer={null}
            >
              <Steps direction="vertical">
                {this.state.metamaskState === 'notInstalled' && <Steps.Step status="process" title={intl.get('wallet_meta.unlock_step_install_title')} description={intl.get('wallet_meta.unlock_step_install_content')} />}
                <Steps.Step status="process" title={intl.get('wallet_meta.unlock_step_unlock_title')} description={intl.get('wallet_meta.unlock_step_unlock_content')} />
                <Steps.Step status="process" title={intl.get('wallet_meta.unlock_step_refresh_title')}
                            description={
                              <div>
                                <div>{intl.get('wallet_meta.unlock_step_refresh_content')}</div>
                                <Button onClick={() => refresh} type="primary" className="mt5" loading={false}>{intl.get('wallet_meta.unlock_refresh_button')}</Button>
                              </div>
                            }
                />
              </Steps>
            </AntdModal>
            <div className="col-auto text-left pl15 " style={{width:'6rem'}}>
              <i className="icon-Metamaskwallet color-black-1 fs26"></i>
            </div>
            <div className="col text-left">
              <div className="fs16 color-black-1 text-left">MetaMask</div>
            </div>
            <div className="col-auto text-right">
              <div className="fs14 text-wrap text-left">
                <span className="fs13 color-black-2 mr5">Unlock</span>
                <Icon className="color-black-2" type="right"/>
              </div>
            </div>
          </div>
          <div onClick={this.unlockByLedger} className="row m15 p15 no-gutters align-items-center bg-primary"
               style={{padding: '7px 0px',borderRadius:'50em'}}>
            <div className="col-auto text-left pl15 " style={{width:'6rem'}}>
              <i className="icon-ledgerwallet color-black-1 fs26"></i>
            </div>
            <div className="col text-left">
              <div className="fs16 color-black-1 text-left">Ledger</div>
            </div>
            <div className="col-auto text-right">
              <div className="fs14 text-wrap text-left">
                <span className="fs13 color-black-2 mr5">Unlock</span>
                <Icon className="color-black-2" type="right"/>
              </div>
            </div>
          </div>
          {
            placeOrderSteps.step === 0 &&
            <div onClick={()=>_this.showLayer({id:'unlockByAddress'})} className="row m15 p15 no-gutters align-items-center bg-primary"
                 style={{padding: '7px 0px',borderRadius:'50em'}}>
              <div className="col-auto text-left pl15 " style={{width:'6rem'}}>
                <i className="icon-eye color-black-1 fs22"></i>
              </div>
              <div className="col text-left">
                <div className="fs16 color-black-1 text-left">Watch-Only Wallet</div>
              </div>
              <div className="col-auto text-right">
                <div className="fs14 text-wrap text-left">
                  <span className="fs13 color-black-2 mr5">Unlock</span>
                  <Icon className="color-black-2" type="right"/>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    item: state.sockets.addressUnlock.item,
    uuid:state.sockets.addressUnlock.extra.uuid,
    scanAddress:state.scanAddress,
    metaMask:state.metaMask,
    placeOrderSteps:state.placeOrderSteps
  }
}

export default connect(mapStateToProps)(Auth)
