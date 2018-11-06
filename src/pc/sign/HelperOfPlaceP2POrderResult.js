import React from 'react';
import {Alert, Icon} from 'antd'
import {Button, Toast} from 'antd-mobile'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import routeActions from 'common/utils/routeActions';
import {getSocketAuthorizationByHash} from 'modules/orders/formatters'
import { toHex } from 'LoopringJS/common/formatter'
import storage from 'modules/storage'
import { OrderFm } from 'modules/orders/OrderFm'

const PlaceOrderResult = (props) => {
  const {placeOrderSteps, circulrNotify, p2pOrder, dispatch} = props
  const {unsign, error} = placeOrderSteps

  const gotToTrade = () => {
    dispatch({type:'layers/hideLayer', payload:{id:'face2FaceConfirm'}})
    dispatch({type:'layers/hideLayer', payload:{id:'helperOfSignStepPC'}})
  }

  const showQRCode = () => {
    const original = unsign.find((item) => item.type === 'order')
    const orderHash = toHex(window.RELAY.order.getOrderHash(original.completeOrder))
    window.RELAY.order.getOrderByHash({orderHash}).then(res => {
      if (res.error) {
        Toast.fail(res.error.message)
      } else {
        const order = res.result
        order.originalOrder.authPrivateKey = original.completeOrder.authPrivateKey;
        if (order.status === 'ORDER_OPENED' || order.status === 'ORDER_WAIT_SUBMIT_RING') {
          const orderFm = new OrderFm(order);
          const p2pOrder = storage.orders.getP2POrder(order.originalOrder.hash)
          showLayer({id:'orderQrcode',value:{type:'P2P',value:p2pOrder},data:{tokens:orderFm.getTokens(),orderFm}})
        }else{
          Toast.fail('This Order is completed, canceled or expired')
        }
      }
    })
  }

  const showOrderDetail = () => {
    const original = unsign.find((item) => item.type === 'order')
    const orderHash = toHex(window.RELAY.order.getOrderHash(original.completeOrder))
    window.RELAY.order.getOrderByHash({orderHash}).then(res => {
      if (res.error) {
        Toast.fail(res.error.message)
      } else {
        const order = res.result
        order.originalOrder.authPrivateKey = original.completeOrder.authPrivateKey;
        if (order.status === 'ORDER_OPENED' || order.status === 'ORDER_WAIT_SUBMIT_RING') {
          dispatch({
            type: 'layers/showLayer',
            payload: {
              id: 'p2pOrderDetail',
              order,
            }
          })
        }else{
          Toast.fail('This Order is completed, canceled or expired')
        }
      }
    })
  }

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

  const signByLooprStep = (placeOrderSteps, circulrNotify) => {
    let step = 0
    const hashItem = getSocketAuthorizationByHash(placeOrderSteps.hash, circulrNotify)
    if(hashItem) {
      switch (hashItem.status) { //init received accept reject
        case 'received':
          step = 1
          break;
        case 'accept':
          step = 2
          break;
        case 'reject':
          step = 3
          break;
        case 'txFailed':
          step = 3
          break;
      }
    }
    return step
  }
  let signResult = placeOrderSteps.step
  if(placeOrderSteps.signWith === 'loopr' || placeOrderSteps.signWith === 'upWallet') {
    signResult = signByLooprStep(placeOrderSteps, circulrNotify)
  }
  const getSignP2P = () => {
    const order = unsign.find((item) => item.type === 'order')
    if(placeOrderSteps.task === 'signP2P' && signResult > 1 && order && order.completeOrder.authPrivateKey) {
      return JSON.stringify({
        type: 'P2P',
        value: {auth: order.completeOrder.authPrivateKey, hash: toHex(window.RELAY.order.getOrderHash(order.completeOrder)), count:p2pOrder.count}
      })
    } else {
      return ''
    }
  }
  return (
    <div className="bg-white-light">
        {
          signResult === 2 &&
          <div className="text-center p35 pb50">
            <i className={`fs50 icon-success color-success`}></i>
            <div className="fs18 color-black-1 mb15">{intl.get('sign.p2p_submit_success')}</div>
            <div className="mt25 text-center">
              <Button className="h-35 fs14 center-center m-auto" style={{width:'75%'}} type="primary" size="small" onClick={showQRCode}>{intl.get('p2p_order.share_qr')}</Button>
              <div className="pt15"></div>
              <Button className="h-35 fs14 center-center m-auto" style={{width:'75%'}} type="primary" size="small" onClick={showOrderDetail}>{intl.get('p2p_order.order_detail')}</Button>
              <div className="pt15"></div>
              <Button className="h-35 fs14 center-center m-auto bg-primary-light text-primary border-none" style={{width:'75%'}} type="primary" size="small" onClick={gotToTrade}>{intl.get('actions.continue_placeorder')} </Button>
            </div>
          </div>
        }
        {
          signResult === 3 &&
          <div className="text-center p35">
            <Icon type="close-circle" className="fs50 color-error" />
            <div className="fs18 mt15 mb10 color-black-1">{intl.get('sign.p2p_submit_failed')}</div>
            {error && <Alert message={error} size="small" type="error" theme="light" icon={false}/>}
            {false && <div className="mt10">
              <Button className="m5" type="default" onClick={gotToTrade}> {intl.get('place_order_result.back_to_trade')} </Button>
            </div>}
          </div>
        }
    </div>
  );
};

function mapToProps(state) {
  return {
    placeOrderSteps: state.placeOrderSteps,
    wallet:state.wallet,
    circulrNotify:state.sockets.circulrNotify,
    p2pOrder: state.p2pOrder,
  }
}

export default connect(mapToProps) (PlaceOrderResult);



