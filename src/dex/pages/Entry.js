import React from 'react'
import {Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import {Button,Modal} from 'antd-mobile'
import {scanQRCode, signMessage, signOrder, signTx} from 'common/utils/signUtils'
import moment from 'moment'
import Notification from 'LoopringUI/components/Notification'

class Entry extends React.Component {

  componentDidMount() {
    const {dispatch}  = this.props
    const type = routeActions.location.getQueryByName(this.props, 'type')
    switch (type) {
      case "UUID":
        this.authToLogin(routeActions.location.getQueryByName(this.props, 'value'));
        break;
      case "P2P":
        const res = {}
        const result = {}
        const value = {}
        value.hash = routeActions.location.getQueryByName(this.props, 'hash')
        value.auth = routeActions.location.getQueryByName(this.props, 'auth')
        value.count = Number(routeActions.location.getQueryByName(this.props, 'count'))
        result.value =value
        result.type = "P2P"
        res.result = JSON.stringify(result)
         window.handleP2POrder(res)
        break;
      case 'sign':
      case 'cancelOrder':
      case 'convert':
        window.RELAY.account.notifyCircular({
          "owner" : window.Wallet.address,
          "body" : {hash: value, "status" : "received"}
        })
        const hash = routeActions.location.getQueryByName(this.props, 'value')
        window.RELAY.order.getTempStore({key: hash}).then(resp => {
          if(resp.error) {
            throw `Unsupported type:${type}`
          }
          let unsigned = null
          switch (type) {
            case 'sign': // [{type:'', data:''}]
              unsigned = JSON.parse(resp.result)
              break;
            case 'cancelOrder': // original order
              unsigned = [{type: 'cancelOrder', data: JSON.parse(resp.result)}]
              break;
            case 'convert': // {tx: '', owner: ''}
              unsigned = [{type: 'convert', data: JSON.parse(resp.result).tx}]
              break;
            default:
              throw `Unsupported type:${type}`
          }
          dispatch({type:'sign/unsigned',payload:{unsigned, qrcode:{type, value:hash}}})
          this.showLayer({id:'signMessages'})
        }).catch(e=> {
          window.RELAY.account.notifyCircular({
            "owner": window.Wallet.address,
            "body": {hash: value, "status": "reject"}
          })
        })
        break;
      default:
    }
  }

  authToLogin = (uuid) => {
    const timestamp = moment().unix().toString();
    signMessage(timestamp).then(res => {
      if(res.result){
        window.RELAY.account.notifyScanLogin({
          sign: {...res.result, owner: window.Wallet.address, timestamp},
          uuid
        }).then(resp => {
          if (resp.result) {
            Notification.open({
              description: intl.get('notifications.title.auth_suc'),
              type: 'success'
            })
          } else {
            Notification.open({
              description: res.error.message,
              type: 'error'
            })
          }
        })
      }
    })
  }

  showLayer = (payload = {}) => {
    this.props.dispatch({
      type: 'layers/showLayer',
      payload: {
        ...payload
      }
    })
  }

  render() {
    const {dispatch} = this.props;
    const scan = () => {
      scanQRCode().then(res => {
        if (res.result) {
          const type = routeActions.search.getQueryByName(res.result, 'type');
          switch (type) {
            case 'UUID':
              this.authToLogin(routeActions.search.getQueryByName(res.result, 'value'));
              break;
            case 'sign':
            case 'cancelOrder':
            case 'convert':
              const hash = routeActions.search.getQueryByName(res.result, 'value')
              window.RELAY.account.notifyCircular({
                "owner" : window.Wallet.address,
                "body" : {hash, "status" : "received"}
              })
              window.RELAY.order.getTempStore({key:hash}).then(resp => {
                if(resp.error) {
                  throw `Unsupported type:${type}`
                }
                let unsigned = null
                switch (type) {
                  case 'sign': // [{type:'', data:''}]
                    unsigned = JSON.parse(resp.result)
                    break;
                  case 'cancelOrder': // original order
                    unsigned = [{type: 'cancelOrder', data: JSON.parse(resp.result)}]
                    break;
                  case 'convert': // {tx: '', owner: ''}
                    unsigned = [{type: 'convert', data: JSON.parse(resp.result).tx}]
                    break;
                  default:
                    throw `Unsupported type:${type}`
                }
                dispatch({type:'sign/unsigned',payload:{unsigned, qrcode:{type, value}}})
                this.showLayer({id:'signMessages'})
              }).catch(e=> {
                window.RELAY.account.notifyCircular({
                  "owner": window.Wallet.address,
                  "body": {hash: value, "status": "reject"}
                })
              })
              break;
            case 'P2P':
              const content = {}
              const result = {}
              const value = {}
              value.hash = routeActions.search.getQueryByName(res.result, 'hash')
              value.auth = routeActions.search.getQueryByName(res.result, 'auth')
              value.count = Number(routeActions.search.getQueryByName(res.result, 'count'))
              result.value =value
              result.type = "P2P"
              content.result = JSON.stringify(result)
              window.handleP2POrder(content)
              break;
            default:
              throw `Unsupported type:${type}`
          }
        }
      }).catch(e => {
        // Toast.fail(e, 10, null, false)
      })
    }
    return (
      <div className="d-flex align-items-center justfiy-content-center" style={{height: '100vh'}}>
        <div className="text-center w-100 p15">
          <Button onClick={routeActions.gotoPath.bind(this, '/dex/placeOrder')} className="d-block w-100 mt15"
                  type="primary"> Go To Market Trade </Button>
          <Button onClick={routeActions.gotoPath.bind(this, '/face2face')} className="d-block w-100 mt15"
                  type="primary"> Go To P2P Trade </Button>
          <Button onClick={scan} className="d-block w-100 mt15" type="primary"> Scan Qrcode </Button>
          <Button onClick={() => this.showLayer({id: 'signMessages'})} className="d-block w-100 mt15" type="primary"> Show
            Messages </Button>
        </div>
      </div>
    )
  }
}

export default connect()(Entry)
