import React from 'react'
import { Icon } from 'antd'
import { Button,SegmentedControl } from 'antd-mobile'
import { connect } from 'dva'
import QRCode from 'qrcode.react'
import Worth from 'modules/settings/Worth'
import intl from 'react-intl-universal'
import TokenFm from "modules/tokens/TokenFm";
import {toFixed,toNumber} from 'LoopringJS/common/formatter'
import config from 'common/config'

const OrderMetaItem = (props) => {
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

class OrderQrcode extends React.Component{
  render(){
    const {wallet} = this.props
    const {value,data:{orderFm,tokens}} = this.props.orderQrcode
    const {originalOrder:{tokenS,tokenB,amountS,amountB,validUntil}} = orderFm.order
    const tokensFm = new TokenFm({symbol:tokenS})
    const tokenbFm = new TokenFm({symbol:tokenB})
    const {dispatch} = this.props
    const hideLayer = (payload={})=>{
      dispatch({
        type:'layers/hideLayer',
        payload:{
          ...payload
        }
      })
    }
    let qrcode = ''
    if(wallet.unlockType === 'imToken') {
      qrcode = `${config.getUrl('imtoken')}/#/auth/imtoken?to=\/dex\/scan&type=${value.type}&auth=${value.value.auth}&count=${value.value.count}&hash=${value.value.hash}`
    } else {
      qrcode = JSON.stringify(value)
    }
    return (
       <div className="bg-white" style={{height:'100%'}}>
        <div className="p25 text-center fs12 color-black-1">
          {intl.get('p2p_order.share_page')}
          <Icon className="text-primary primary fs12 ml15 cursor-pointer" onClick={()=>hideLayer({id:'orderQrcode'})} key="1" type="close"/>
        </div>
        <div className="text-center bg-white-light ml25 mr25 pl15 pr15 pb15">
          {wallet.unlockType === 'imToken' &&
            <div className="pt25 pb10 center-center">
              <img className="h-40" src={require('../assets/images/up-logo-notext.png')} alt=""/>
              <span className="fs18 font-weight-bold ml10 text-primary">Circulr DEX</span>
              <img hidden className="h-50 ml15 bg-primary" src={require('../assets/images/imtoken-white.png')} alt=""/>
            </div>
          }
          {wallet.unlockType !== 'imToken' &&
            <div className="pt25 pb10 center-center">
              <img className="h-40" src={require('../assets/images/up-logo-notext.png')} alt=""/>
              <span className="fs18 font-weight-bold ml10 text-primary">Circulr DEX</span>
            </div>
          }
          {
            false &&
            <div  className="pt15">
              <SegmentedControl
                values={["imToken", "UP Wallet"]}
                className={`m-auto`}
                selectedIndex={true ? 0 : 1}
                style={{width:"240px"}}
                onChange={()=>{}}
              />
            </div>
          }
          
          <div className="pt15 d-inline-block" >
            <div className="p5" style={{background:'#fff'}}>
              <QRCode value={qrcode} size={220} level='H'/>
            </div>
            {wallet.unlockType === 'imToken' &&
            <div className="mt15 border-none bg-primary color-white fs12 d-block circle h-30 lh-30 center-center">
              <img className="h-15 mr10" src={require('../assets/images/imtoken-white.png')} alt=""/>{intl.get('place_order_by_imtoken.share_with_imtoken')}
            </div>
            }
            {wallet.unlockType !== 'imToken' &&
            <div className="mt15 border-none bg-primary color-white fs12 d-block circle h-30 lh-30 center-center">
              {intl.get('place_order_by_upwallet.share_with_upwallet')}
            </div>
            }
          </div>
        </div>
        <div className="zb-b-t pt15 pb15 ml25 mr25 text-center bg-white-light">
          {false && <OrderMetaItem label={intl.get('order.price')} value={
            <div>
              <span className="color-black-4 pr5"><Worth amount={orderFm.getPrice()} symbol={tokens.right}/></span> {orderFm.getPrice()} { tokens.right }
            </div>
          }/>}
          <OrderMetaItem label={intl.get('common.sell')} value={orderFm.getSell()}/>
          <OrderMetaItem label={intl.get('common.buy')} value={orderFm.getBuy()}/>
          <OrderMetaItem label={intl.get('common.buy')+' '+intl.get('order.price')} value={
            <span>
                  {`1 ${tokenB} = ${Number(toFixed(tokensFm.getUnitAmount(amountS).div(tokenbFm.getUnitAmount(amountB)),8))} ${tokenS} ≈`} <Worth amount={tokensFm.getUnitAmount(amountS).div(tokenbFm.getUnitAmount(amountB))} symbol={tokenS}/>
                </span>
          }/>

          <OrderMetaItem label={intl.get('common.sell')+' '+intl.get('order.price')} value={
            <span>
                  {`1 ${tokenS} = ${Number(toFixed(tokenbFm.getUnitAmount(amountB).div(tokensFm.getUnitAmount(amountS)),8))} ${tokenB} ≈`} <Worth amount={tokenbFm.getUnitAmount(amountB).div(tokensFm.getUnitAmount(amountS))} symbol={tokenB}/>
                </span>
          }/>
          <OrderMetaItem label={intl.get('common.ttl')} value={orderFm.getValidTime()}/>
        </div>
      </div>
    )
  }
}

function mapToProps(state) {
  return {
    wallet:state.wallet
  }
}

export default connect(mapToProps)(OrderQrcode)
