import React from 'react'
import { Icon } from 'antd'
import { Button } from 'antd-mobile'
import { connect } from 'dva'
import QRCode from 'qrcode.react'
import Worth from 'modules/settings/Worth'
import intl from 'react-intl-universal'
import TokenFm from "modules/tokens/TokenFm";
import {toFixed,toNumber} from 'LoopringJS/common/formatter'

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

    return (
       <div className="bg-white" style={{height:'100%'}}>
        <div className="p25 text-center fs12 color-black-1">
          Share this page to your friends
          <Icon className="text-primary primary fs12 ml15 cursor-pointer" onClick={()=>hideLayer({id:'orderQrcode'})} key="1" type="close"/>
        </div>
        <div className="text-center bg-white-light ml25 mr25 pl15 pr15 pb15">
          <div className="pt25 pb25 center-center">
            <img className="h-45" src={require('../assets/images/up-logo-notext.png')} alt=""/>
            <span className="fs20 font-weight-bold ml10 text-primary">UP DEX</span>
          </div>
          <div className="p5 d-inline-block" style={{background:'#fff'}}>
            <QRCode value={JSON.stringify(value)} size={220} level='H'/>
          </div>
          <Button type="primary" size="small" className="mt15 border-none bg-primary-light text-primary fs12 d-block w-100">
            <Icon type="apple" className="mr5" theme="filled" />请使用 UP Wallet iOS 版进行扫码吃单
          </Button>

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

export default connect()(OrderQrcode)
