import React from 'react'
import {Redirect, Route, Switch } from 'dva/router'
import {connect } from 'dva'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import { TabBar,Button } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import {signTx, signOrder, scanQRCode} from 'common/utils/signUtils'

class Entry extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location,dispatch} = this.props;
    const {url} = match;
    const {pathname} = location;

    const scan = ()=>{
      dispatch({type:'sign/signedChange',payload:{signed}})
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
