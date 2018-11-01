import React from 'react';
import {Alert, Button, Icon} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import routeActions from 'common/utils/routeActions';
import QRCode from "qrcode.react";
import {getSocketAuthorizationByHash} from 'modules/orders/formatters'
import { toHex } from 'LoopringJS/common/formatter'

const PlaceOrderResult = (props) => {
  const {placeOrderSteps, circulrNotify, p2pOrder, dispatch} = props
  const {unsign, error} = placeOrderSteps
  const gotToTrade = () => {
    dispatch({type:'layers/hideLayer', payload:{id:'placeOrderSteps'}})
    dispatch({type:'layers/hideLayer', payload:{id:'helperOfSignStepPC'}})
    routeActions.gotoPath('/trade2');
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
  const getSignP2P = () => {
    const signResult = signByLooprStep(placeOrderSteps, circulrNotify)
    const order = unsign.find((item) => item.type === 'order')
    if(placeOrderSteps.task === 'signP2P' && signResult > 1 && order && order.completeOrder.authPrivateKey) {
      return JSON.stringify({
        type: 'P2P',
        value: {auth: order.completeOrder.authPrivateKey, hash: toHex(window.RELAY.order.getOrderHash(order.completeOrder)), count:1}
      })
    } else {
      return ''
    }
  }
  console.log(1231, unsign, placeOrderSteps, p2pOrder)
  const signResult = signByLooprStep(placeOrderSteps, circulrNotify)
  const qrcodeData = getSignP2P()
  return (
    <div className="bg-white-light">
        {
          signResult === 2 &&
          <div className="text-center p35">
            <i className={`fs50 icon-success color-success`}></i>
            <div className="fs18 color-black-1">{intl.get('sign.submit_success')}</div>
            {
              placeOrderSteps.task === 'signP2P' &&
              <div>
                <div className="p5 d-inline-block pb0" style={{background:'#fff',minHeight:'210px'}}>
                  <QRCode value={{a:'aaa'}} size={210} level='H'/>
                </div>
              </div>
            }
            {false && <div className="mt10">
              <Button className="m5" type="default"> {intl.get('place_order_result.view_order')} </Button>
              <Button className="m5" type="default" onClick={gotToTrade}> {intl.get('place_order_result.continue_place_order')} </Button>
            </div>}
          </div>
        }
        {
          signResult === 3 &&
          <div className="text-center p35">
            <Icon type="close-circle" className="fs50 color-error" />
            <div className="fs18 mt15 mb10 color-black-1">{intl.get('sign.submit_failed')}</div>
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



