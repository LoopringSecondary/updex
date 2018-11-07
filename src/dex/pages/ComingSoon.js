import React from 'react'
import { Icon } from 'antd'
import { Button } from 'antd-mobile'
import { connect } from 'dva'
import QRCode from 'qrcode.react'
import Worth from 'modules/settings/Worth'
import intl from 'react-intl-universal'
import TokenFm from "modules/tokens/TokenFm";
import {toFixed,toNumber} from 'LoopringJS/common/formatter'

const MetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pt10 pb10  zb-b-t no-gutters align-items-center">
      <div className="col pl15 ">
        <div className="fs14 color-black-1 text-left">{label}</div>
      </div>
      <div className="col-auto text-right pr15">
        <div className="fs14 color-black-2 text-wrap text-right">{value}</div>
      </div>
    </div>
  )
}

class ComingSoon extends React.Component{
  render(){
    return (
       <div className="bg-white center-center" style={{height:'100vh'}}>
        <div className="text-center w-100">
          <div className="pt15 pb15 zb-b-b">
            <img className="h-45" src={require('../../assets/images/up-logo-notext.png')} alt=""/>
            <div className="fs20 font-weight-bold mt10 text-primary">UP DEX</div>
          </div>
          <div className="m15 p15 color-white fs13">
            <Icon type="desktop" className="color-white mr5" /> 请通过电脑访问 http://dex.upwallet.io
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(ComingSoon)
