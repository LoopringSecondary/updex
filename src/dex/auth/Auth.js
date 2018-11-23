import React from 'react'
import { Button, NavBar, Modal,List,InputItem,TextareaItem,Toast } from 'antd-mobile'
import routeActions from 'common/utils/routeActions'
import UserAgent from 'common/utils/useragent'
import { connect } from 'dva'
import { Icon } from 'antd'
import storage from 'modules/storage'
import uuidv4 from 'uuid/v4'
import intl from 'react-intl-universal'

class Auth extends React.Component {
  state={
    address:''
  }
  componentWillReceiveProps(newProps){
    const {uuid,item} = newProps
    if(uuid && uuid === item.uuid){
      // Modal.alert(intl.get('notifications.title.log_in_suc'))
      storage.wallet.storeUnlockedAddress('address', item.owner)
      window.RELAY.account.register(item.address)
       routeActions.gotoPath('/dex')
      this.props.dispatch({
        type: 'sockets/extraChange',
        payload: {id: 'addressUnlock', extra: {uuid:""}}
      })
      this.props.dispatch({type: 'sockets/unlocked'});
    }
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
      routeActions.gotoPath('/dex')
      this.props.dispatch({
        type: 'sockets/extraChange',
        payload: {id: 'addressUnlock', extra: {uuid:""}}
      })
      this.props.dispatch({type: 'sockets/unlocked'});
    }else{
      Toast.fail(intl.get("notifications.title.invalid_address_tip"))
    }
  }

  amountChange = (value) => {
    this.setState({address:value})
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
  render () {
    const {uuid,item,dispatch} = this.props
    const {address} = this.state;
    const _this = this
    return (
      <div className="bg-white" style={{height:'100%',overflow:'auto'}}>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={()=>dispatch({type:'layers/hideLayer',payload:{id:'authOfMobile'}})}
          leftContent={[
            <span onClick={()=>{}} className="text-primary" key="1"><Icon type="close" /></span>,
          ]}
          rightContent={null && [
            <span className="color-black-1" key="1"  onClick={()=>{}}><Icon type="question-circle-o" /></span>
          ]}
        >
          <div className="color-black-1 fs16">
            Unlock Wallet
          </div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
        <div className="pt30 pb40 pl15 pr15">
          <div className="text-center">
            <img className="h-45" src={require('../../assets/images/up-logo-notext.png')} alt=""/>
            <div className="text-primary fs18 font-weight-bold mt5">UP DEX</div>
          </div>
        </div>
        <div className="">
          <div className="row ml15 mr15 mb15 p15 no-gutters align-items-center bg-primary"
               style={{padding: '0px 0px',borderRadius:'50em'}}>
            <div className="col-auto text-left ml5 mr15 w-25">
              <img style={{height: '24px'}} src={require('../../assets/images/up-logo-notext-white.png')} alt=""/>
            </div>
            <div className="col text-left">
              <div className="fs16 color-black text-left">UP Wallet</div>
            </div>
            <div className="col-auto text-right">
              <div className="fs14 text-wrap text-left">
                <span className="fs13 color-black-2 mr5">Unlock</span>
                <Icon className="color-black-2" type="right"/>
              </div>
            </div>
          </div>
          <div className="row ml15 mr15 mb15 p15 no-gutters align-items-center bg-primary" style={{padding: '0px 0px',borderRadius:'50em'}}>
            <div className="col-auto text-left ml5 mr15 w-25">
              <i className="icon-loopr color-black-1 fs22"></i>
            </div>
            <div className="col text-left">
              <div className="fs16 color-black text-left">Loopr Wallet</div>
            </div>
            <div className="col-auto text-right">
              <div className="fs14 text-wrap text-left">
                <span className="fs13 color-black-2 mr5">Unlock</span>
                <Icon className="color-black-2" type="right"/>
              </div>
            </div>
          </div>
          <div onClick={()=>{_this.hideLayer({id:"authOfMobile"}); _this.showLayer({id:'unlockByAddress'})}} className="cursor-pointer row ml15 mr15 p15 no-gutters align-items-center bg-primary"
               style={{padding: '0px 0px',borderRadius:'50em'}}>
            <div className="col-auto text-left ml5 mr15 w-25">
              <i className="icon-eye color-black-1 fs20"></i>
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
          <div className="p5 pb10 text-center"style={{position:'absolute',bottom:'0',left:0,right:0}}>
            <div className="fs12 color-black-4">v1.0.3</div>
          </div>
        </div>

      </div>
    )
  }

}

function mapStateToProps (state) {
  return {
    item: state.sockets.addressUnlock.item,
    uuid:state.sockets.addressUnlock.extra.uuid
  }
}

export default connect(mapStateToProps)(Auth)
