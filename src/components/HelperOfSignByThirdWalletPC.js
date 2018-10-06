import React from 'react'
import {connect} from 'dva'
import {Icon, Modal} from 'antd'


class SignByThirdWallet extends React.Component {

  sign = (wallet) => {
    const userAgentInfo = navigator.userAgent
    const isiOS = !!userAgentInfo.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
    if (isiOS) {
      const {helperOfSign, dispatch} = this.props
      const {data} = helperOfSign
      window.location = `${wallet}://${JSON.stringify(data)}`
      dispatch({
        type: 'layers/hideLayer',
        payload: {
          id: 'helperOfSign'
        }
      })
    } else {
      alert('Coming Soon')
    }
  }

  render() {
    return (
      <div className="bg-white" style={{height:'100%'}}>
        <div className="row ml0 mr0 p15 zb-b-b no-gutters align-items-center" style={{padding: '7px 0px'}}>
          <div className="col-auto text-right">
            <Icon hidden className="color-black-4" type="left"/>
          </div>
          <div className="col text-cennter">
            <div className="fs18 color-black-1 text-center">Sign Order By Wallet</div>
          </div>
          <div className="col-auto text-right">
            <Icon hidden className="color-black-4" type="close"/>
          </div>
        </div>
        <div className="pt10">
          <div onClick={()=>{}} className="row m15 p15 no-gutters align-items-center bg-fill"
               style={{padding: '7px 0px',borderRadius:'50em'}}>
            <div className="col-auto text-left pl15 pr20">
              <img style={{height: '30px'}} src={require('../assets/images/up-logo-notext.png')} alt=""/>
            </div>
            <div className="col text-left">
              <div className="fs16 text-primary text-left">UP Wallet</div>
            </div>
            <div className="col-auto text-right">
              <div className="fs14 text-wrap text-left">
                <span className="fs13 color-black-4 mr5">Scan Qrcode</span>
                <Icon className="color-black-4" type="right"/>
              </div>
            </div>
          </div>
          <div onClick={()=>{}} className="row m15 p15 no-gutters align-items-center bg-fill"
               style={{padding: '7px 0px',borderRadius:'50em'}}>
            <div className="col-auto text-left pl15 pr20">
              <i className="icon-loopr text-primary fs28"></i>
            </div>
            <div className="col text-left">
              <div className="fs16 text-primary text-left">Loopr Wallet</div>
            </div>
            <div className="col-auto text-right">
              <div className="fs14 text-wrap text-left">
                <span className="fs13 color-black-4 mr5">Scan Qrcode</span>
                <Icon className="color-black-4" type="right"/>
              </div>
            </div>
          </div>
          <div onClick={()=>{}} className="row m15 p15 no-gutters align-items-center bg-fill"
               style={{padding: '7px 0px',borderRadius:'50em'}}>
            <div className="col-auto text-left pl15 pr20">
              <i className="icon-Metamaskwallet text-primary fs26"></i>
            </div>
            <div className="col text-left">
              <div className="fs16 text-primary text-left">MetaMask</div>
            </div>
            <div className="col-auto text-right">
              <div className="fs14 text-wrap text-left">
                <span className="fs13 color-black-4 mr5">Connect</span>
                <Icon className="color-black-4" type="right"/>
              </div>
            </div>
          </div>
          <div onClick={()=>{}} className="row m15 p15 no-gutters align-items-center bg-fill"
               style={{padding: '7px 0px',borderRadius:'50em'}}>
            <div className="col-auto text-left pl15 pr20">
              <i className="icon-ledgerwallet text-primary fs26"></i>
            </div>
            <div className="col text-left">
              <div className="fs16 text-primary text-left">Ledger</div>
            </div>
            <div className="col-auto text-right">
              <div className="fs14 text-wrap text-left">
                <span className="fs13 color-black-4 mr5">Connect</span>
                <Icon className="color-black-4" type="right"/>
              </div>
            </div>
          </div>
        </div>
        <div className="fs13 color-black-4 text-center p10">
          More Wallets is Comming Soon
        </div>
      </div>
    )
  }

}


function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(SignByThirdWallet)
