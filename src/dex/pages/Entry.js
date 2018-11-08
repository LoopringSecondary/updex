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
      scanQRCode().then(qrcode => {
        const code = JSON.parse(qrcode)
        switch(code.type) {
          case 'UUID': // UUID
            // updateScanLogin(owner, uuid, r, s, v, timstamp)
            break;
          case 'sign': // [{type:'', data:''}]
          case 'cancelOrder': // original order
          case 'convert': // {tx: '', owner: ''}
            // getTempStore(code.hash)
            //TODO TEST
            const unsigned = [{"type":"order","data":{"owner":"0xebA7136A36DA0F5e16c6bDBC739c716Bb5B65a00","delegateAddress":"0x17233e07c67d086464fD408148c3ABB56245FA64","protocol":"0x8d8812b72d1e4ffCeC158D25f56748b7d67c1e78","tokenB":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","tokenS":"0xef68e7c694f40c8202821edf525de3782458639f","amountB":"0x10a741a462780000","amountS":"0xa688906bd8b00000","lrcFee":"0x41c7dce2eb5a0000","validSince":"0x5be3cea8","validUntil":"0x5be52028","marginSplitPercentage":50,"buyNoMoreThanAmountB":false,"walletAddress":"0x56447c02767ba621f103c0f3dbf564dbcacf284b","orderType":"market_order","authAddr":"0x26b8ba9b1a1c31bd62415ac0e830742f2b003a18","authPrivateKey":"a92f9b5153450426399f2287cec258a9994c3669d30fe35cbd6f240fd13f763d"}}]
            dispatch({type:'sign/unsigned',payload:{unsigned}})
            showLayer({id:'signMessages'})
            break;
          case 'P2P': // {"type":"P2P","value":{"auth":"4f66f318a5bccf372309abcfdef7166e7a35ea61627f5f80454f8d1a563a7f52","hash":"0x0d0ab8aa96b7637e0caede417be2c1dcdc328545086165a61daa9aebe98e8080","count":1}}
            // getOrderByHash
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
