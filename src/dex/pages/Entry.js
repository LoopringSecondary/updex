import React from 'react'
import {Redirect, Route, Switch } from 'dva/router'
import {connect } from 'dva'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import {TabBar, Button, Modal, Toast} from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import {signTx, signOrder, scanQRCode,signMessage} from 'common/utils/signUtils'
import moment from 'moment'
import Notification from 'LoopringUI/components/Notification'

class Entry extends React.Component {

  constructor(props) {
    super(props);
  }
  render(){
    const {match,location,dispatch} = this.props;
    const {url} = match;
    const {pathname} = location;

    const scan = ()=>{
      scanQRCode().then(res => {
        if(!res.result){
          return
        }
        const code = JSON.parse(res.result)
        switch(code.type) {
          case 'UUID':
            const timestamp = moment().unix().toString();
            signMessage(timestamp).then(res => {
              window.RELAY.account.notifyScanLogin({sign:{...res.result,owner:window.Wallet.address,timestamp},uuid:code.value}).then(resp => {
              if(resp.result){
                Notification.open({
                  message: intl.get('notifications.title.auth_suc'),
                  type: 'success'
                })
              }else{
                Notification.open({
                  message: res.error.message,
                  type: 'error'
                })
              }
              })
            })
            break;
          case 'sign':
          case 'cancelOrder':
          case 'convert':
            window.RELAY.account.notifyCircular({
              "owner" : window.Wallet.address,
              "body" : {hash: code.value, "status" : "received"}
            })
            window.RELAY.order.getTempStore({key:code.value}).then(resp => {
              if(resp.error) {
                throw `Unsupported type:${code.type}`
              }
              let unsigned = null
              switch(code.type) {
                case 'sign': // [{type:'', data:''}]
                  unsigned = JSON.parse(resp.result)
                  break;
                case 'cancelOrder': // original order
                  unsigned = [{type:'cancelOrder', data:JSON.parse(resp.result)}]
                  break;
                case 'convert': // {tx: '', owner: ''}
                  unsigned = [{type:'convert', data:JSON.parse(resp.result).tx}]
                  break;
                default:
                  throw `Unsupported type:${code.type}`
              }
              dispatch({type:'sign/unsigned',payload:{unsigned, qrcode:code}})
              showLayer({id:'signMessages'})
            }).catch(e=>{
              window.RELAY.account.notifyCircular({
                "owner" : window.Wallet.address,
                "body" : {hash: code.value, "status" : "reject"}
              })
            })
            break;
          case 'P2P':
           window.handleP2POrder(res);
            break;
          default:
            throw `Unsupported type:${code.type}`
        }
      }).catch(e => {
        // Toast.fail(e, 10, null, false)
      })
    }
    const showLayer = (payload = {}) => {
      dispatch({
        type: 'layers/showLayer',
        payload: {
          ...payload
        }
      })
    }
    return (
      <div className="d-flex align-items-center justfiy-content-center" style={{height:'100vh'}}>
        <div className="text-center w-100 p15">
          <Button onClick={routeActions.gotoPath.bind(this,'/dex/placeOrder')} className="d-block w-100 mt15" type="primary"> Go To Market Trade </Button>
          <Button onClick={routeActions.gotoPath.bind(this,'/face2face')} className="d-block w-100 mt15" type="primary"> Go To P2P Trade </Button>
          <Button onClick={scan} className="d-block w-100 mt15" type="primary"> Scan Qrcode </Button>
          <Button onClick={()=>showLayer({id:'signMessages'})} className="d-block w-100 mt15" type="primary"> Show Messages </Button>
        </div>
      </div>
    )
  }
}

export default connect()(Entry)
