import React from 'react'
import { Button, NavBar, Modal,List,InputItem,Toast } from 'antd-mobile'
import { connect } from 'dva'
import { Icon, Collapse, Steps, Modal as AntdModal } from 'antd'
import storage from 'modules/storage'
import intl from 'react-intl-universal'

const dpath = "m/44'/60'/0'";

class Auth extends React.Component {
  state={
    address:'',
  }
  componentDidMount() {
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
      this.props.dispatch({
        type: 'layers/hideLayer',
        payload: {id: 'unlockByAddress'}
      })
      this.props.dispatch({type: 'sockets/unlocked'});
      Modal.alert(intl.get('notifications.title.log_in_suc'))
    }else{
      Toast.fail(intl.get("notifications.title.invalid_address_tip"))
    }
  }

  render () {
    const {dispatch} = this.props
    const {address} = this.state;

    const _this = this
    return (
      <div className="bg-white" style={{height:'100vh',overflow:'auto'}}>
        <NavBar
          className="bg-white"
          mode="light"
          leftContent={[
            <span onClick={()=>_this.hideLayer({id:'unlockByAddress'})} className="text-primary fs14 cursor-pointer" key="1"><Icon type="close" /></span>,
          ]}
          rightContent={[]}
        >
          <div className="color-black-1 fs16">
            Watch-Only Wallet
          </div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
        <div className="p15 pt50">
          <List className="no-border am-list-bg-none selectable">
            <InputItem
              type="text"
              onChange={(value)=>{this.setState({address:value})}}
              value={address}
              className="circle h-default color-black-2 fs13"
              placeholder="Paste ETH address"
              extra={<Icon hidden type="scan" />}
              clear
            >
            </InputItem>
          </List>
          <Button onClick={this.authByAddress} className="mt20 fs18" type="primary">Unlock</Button>
        </div>

      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
  }
}

export default connect(mapStateToProps)(Auth)
