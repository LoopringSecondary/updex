import React from 'react'
import {Redirect, Route, Switch } from 'dva/router'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import { TabBar,Button } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import UserCenter from '../account/UserCenter'
import Markets from '../tickers/Markets'
import PlaceOrder from '../orders/PlaceOrderForm'
import {signTx, signOrder, scanQRCode} from 'common/utils/signUtils'

class Entry extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location} = this.props;
    const {url} = match;
    const {pathname} = location;

    const sign = (data) => {
      switch(data.type) {
        case 'order':

          break;
        case 'cancelOrder':

          break;
        case 'approve':

          break;
        case 'approveZero':

          break;
        case 'convert':

          break;
        case 'resendTx':

          break;
        case 'transfer':

          break;
        default:
          throw new Error(`Unsupported type:${data.type}`)
      }
    }

    const scan = ()=>{
      scanQRCode().then(qrcode => {
        const code = JSON.parse(qrcode)
        switch(code.type) {
          case 'UUID': // UUID
            // updateScanLogin(owner, uuid, r, s, v, timstamp)
            break;
          case 'sign': // [{type:'', data:''}]
          case 'cancelOrder': // original order
          case 'convert': // {tx: '', owner: ''}
            // getTempStore(hash)
            break;
          default:
            throw new Error(`Unsupported type:${code.type}`)
        }
      }).catch(e => {
        // TODO notify
      })
    }
    return (
      <div className="d-flex align-items-center justfiy-content-center" style={{height:'100vh'}}>
        <div className="text-center w-100 p15">
          <Button onClick={routeActions.gotoPath.bind(this,'/dex/placeOrder')} className="d-block w-100 mt15" type="primary"> Go To Market Trade </Button>
          <Button onClick={routeActions.gotoPath.bind(this,'/face2face')} className="d-block w-100 mt15" type="primary"> Go To P2P Trade </Button>
          <Button onClick={scan} className="d-block w-100 mt15" type="primary"> Scan Qrcode </Button>
        </div>
      </div>
    )
  }
}

export default Entry
