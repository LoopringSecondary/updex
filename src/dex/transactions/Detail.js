import React from 'react'
import { Icon } from 'antd'
import { NavBar, NoticeBar } from 'antd-mobile'
import intl from 'react-intl-universal'
import { connect } from 'dva'
import routeActions from 'common/utils/routeActions'
import { OrderFm } from 'modules/orders/OrderFm'
import Worth from 'modules/settings/Worth'

const MetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pt10 pb10 pl15 pr15 zb-b-b no-gutters align-items-center" style={{padding:'7px 0px'}}>
      <div className="col">
        <div className="fs14 color-black-2 text-left">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs14 color-black-2 text-wrap text-left">{value}</div>
      </div>
    </div>
  )
}

function TxDetail(props) {
  const {txDetail,dispatch} = props
  const {order} = txDetail;
  if(!order){
    return null
  }
  const orderFm = new OrderFm(order);

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
    <div className="bg-fill position-relative" style={{height:"100%"}}>
      <div className="position-absolute w-100" style={{zIndex:'1000'}}>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={()=>hideLayer({id:'txDetail'})}
          leftContent={[
            <span key='1' className=""><Icon type="close"/></span>,
          ]}
          rightContent={null && [
            <Icon key="1" type="question-circle-o"/>,
          ]}
        >
          <div className="color-black">{intl.get('common.order')}</div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
      </div>
      <div style={{overflow:'auto',paddingTop:'4.5rem',paddingBottom:'3rem',height:'100%'}}>
        <div className="mb10 mt10 bg-white">
          <div className="fs16 color-black text-left pt10 pb10 pl15 zb-b-b">{intl.get('order_detail.tabs_basic')}</div>
          <div className="" style={{borderRadius:'0rem'}}>
            <MetaItem label={intl.get('order.status')} value={orderStatus(order)}/>
            <MetaItem label={intl.get('order.filled')} value={`${orderFm.getFilledPercent()}%`}/>
            <MetaItem label={intl.get('order.price')} value={
              <div>
                <span className="color-black-4 pr5"><Worth amount={orderFm.getPrice()} symbol={tokens.right}/></span> {orderFm.getPrice()} { tokens.right }
              </div>
            }/>
            <MetaItem label={intl.get('common.sell')} value={orderFm.getSell()}/>
            <MetaItem label={intl.get('common.buy')} value={orderFm.getBuy()}/>
            <MetaItem label={intl.get('order.LRCFee')} value={orderFm.getLRCFee()}/>
            <MetaItem label={intl.get('common.ttl')} value={orderFm.getValidTime()}/>
          </div>
        </div>
      </div>
    </div>
  )
}
export default connect()(TxDetail)
