import React from 'react'
import { Icon } from 'antd'
import { NavBar } from 'antd-mobile'
import { connect } from 'dva'
import QRCode from 'qrcode.react'
import Worth from 'modules/settings/Worth'
import intl from 'react-intl-universal'
import TokenFm from "modules/tokens/TokenFm";
import {toFixed,toNumber} from 'LoopringJS/common/formatter'

const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pt10 pb10  zb-b-b no-gutters align-items-center" style={{padding:'7px 0px'}}>
      <div className="col">
        <div className="fs14 color-black-1 text-left">{label}</div>
      </div>
      <div className="col-auto text-right">
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
      <div className="bg-white">
        <div className="p15 color-black-1 fs18 zb-b-b text-center no-gutters">
          <div className="row">
            <div className="col-auto text-left pl20 pr20">
            </div>
            <div className="col">{intl.get('p2p_order.user_center_p2p')}</div>
            <div className="col-auto color-white pl20 pr20">
            </div>
          </div>
        </div>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={()=>hideLayer({id:'orderQrcode'})}
          leftContent={[
            <span key='1' className=""><Icon type="close"/></span>,
          ]}
          rightContent={null && [
            <Icon key="1" type="question-circle-o"/>,
          ]}
        >
          <div className="color-black">{intl.get('p2p_order.user_center_p2p')}</div>
        </NavBar>
        <div className="text-center mt15">
          <div className="p15 d-inline-block" style={{background:'#fff'}}>
            <QRCode value={JSON.stringify(value)} size={240} level='H'/>
          </div>
        </div>
        <div className="m15 zb-b-t p15 text-center">
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
