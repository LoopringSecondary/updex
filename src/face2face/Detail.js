import React from 'react'
import { Icon } from 'antd'
import { NavBar,Button } from 'antd-mobile'
import intl from 'react-intl-universal'
import { connect } from 'dva'
import { OrderFm } from 'modules/orders/OrderFm'
import Worth from 'modules/settings/Worth'
import storage from 'modules/storage'
import DetailFills from 'mobile/orders/DetailFills'
import {toFixed} from 'LoopringJS/common/formatter'
import TokenFm from "modules/tokens/TokenFm";

const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pt10 pb10 pl15 pr15 zb-b-b no-gutters align-items-center" style={{padding:'7px 0px'}}>
      <div className="col">
        <div className="fs12 color-black-1 text-left">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs12 color-black-2 text-wrap text-left">{value}</div>
      </div>
    </div>
  )
}
function OrderDetail(props) {
  const {p2pOrderDetail,dispatch} = props
  const {order} = p2pOrderDetail;
  const orderFm = new OrderFm(order);
  const {originalOrder:{tokenS,tokenB,amountS,amountB}} = order
  const tokensFm = new TokenFm({symbol:tokenS})
  const tokenbFm = new TokenFm({symbol:tokenB})
  const showLayer = (payload={})=>{
    dispatch({
      type:'layers/showLayer',
      payload:{
        ...payload
      }
    })
  }
  const hideLayer = (payload={})=>{
    dispatch({
      type:'layers/hideLayer',
      payload:{
        ...payload
      }
    })
  }

  const showQR = (order,orderFm,tokens) => {
   const p2pOrder = storage.orders.getP2POrder(order.originalOrder.hash)
    showLayer({id:'orderQrcode',value:{type:'P2P',value:p2pOrder},data:{tokens,orderFm}})
  }

  const orderStatus = (item) => {
    if (item.status === 'ORDER_OPENED') {
      return intl.get("order_status.opened")
    }
    if (item.status === 'ORDER_FINISHED') {
      return intl.get("order_status.completed")
    }
    if (item.status === 'ORDER_CANCELLED') {
      return intl.get("order_status.canceled")
    }
    if (item.status === 'ORDER_CUTOFF') {
      return intl.get("order_status.canceled")
    }
    if (item.status === 'ORDER_EXPIRE') {
      return intl.get("order_status.expired")
    }
    if (item.status === 'ORDER_PENDING') {
      return intl.get("order_status.pending")
    }
    if (item.status === 'ORDER_CANCELLING') {
      return intl.get("order_status.canceling")
    }
    if (item.status === 'ORDER_WAIT_SUBMIT_RING') {
      return intl.get("order_status.waiting")
    }
  }
  const tokens = orderFm.getTokens()
  return (
    <div className="bg-fill position-relative" style={{height:"100%",overflow:'auto'}}>
      <div className="position-absolute w-100" style={{zIndex:'1000'}}>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={()=>hideLayer({id:'p2pOrderDetail'})}
          leftContent={[
            <span key='1' className=""><Icon type="close"/></span>,
          ]}
          rightContent={null && [
            <Icon key="1" type="question-circle-o"/>,
          ]}
        >
          <div className="color-black">{intl.get('order_detail.page_title')}</div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
      </div>
      <div className="pt45 pb30" style={{overflow:'auto',height:'100%'}}>
        <div className="bg-white">
          <div className="fs16 color-black text-left pt10 pb10 pl15 zb-b-b">{intl.get('order_detail.order_status_title')}</div>
          <div className="">
            <OrderMetaItem label={intl.get('order.status')} value={orderStatus(order)}/>
            <OrderMetaItem label={intl.get('order.filled')} value={`${orderFm.getFilledPercent()}%`}/>
          </div>
        </div>
        <div className="bg-white mt10">
          <div className="fs16 color-black text-left pt10 pb10 pl15 zb-b-b">{intl.get('order_detail.order_basic_title')}</div>
          <div className="">
            <OrderMetaItem label={intl.get('common.sell')} value={orderFm.getSell()}/>
            <OrderMetaItem label={intl.get('common.buy')} value={orderFm.getBuy()}/>
            {false && <OrderMetaItem label={intl.get('order.price')} value={
              <div>
                <span className="color-black-4 pr5"><Worth amount={orderFm.getPrice()} symbol={tokens.right}/></span> {orderFm.getPrice()} { tokens.right }
              </div>
            }/>}
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

            <OrderMetaItem label={intl.get('order.LRCFee')} value={orderFm.getLRCFee()}/>
            <OrderMetaItem label={intl.get('common.ttl')} value={orderFm.getValidTime()}/>
          </div>
        </div>
        <div className="bg-white mt10">
          <div className="fs16 color-black text-left pt10 pb10 pl15 zb-b-b">{intl.get('order_detail.order_fills_title')}</div>
          <div className="" style={{borderRadius:'0rem'}}>
            <DetailFills order={order} />
          </div>
        </div>
        {(order.status === "ORDER_OPENED" || order.status ==="ORDER_WAIT_SUBMIT_RING") && storage.orders.getP2POrder(order.originalOrder.hash) &&
         <Button className="fs14 mt10 ml10 mr10" type="primary" onClick={()=>showQR(order,orderFm,tokens)}>{intl.get('p2p_order.share_qr')}</Button>
        }
      </div>
    </div>
  )
}
export default connect()(OrderDetail)
