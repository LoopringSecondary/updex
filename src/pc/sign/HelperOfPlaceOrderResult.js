import React from 'react';
import {Alert, Icon} from 'antd'
import {Button} from 'antd-mobile'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import routeActions from 'common/utils/routeActions';
import {getSocketAuthorizationByHash} from 'modules/orders/formatters'

const PlaceOrderResult = (props) => {
  const {placeOrderSteps, circulrNotify, dispatch} = props
  const {step, error} = placeOrderSteps
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
  let signResult = placeOrderSteps.step
  if(placeOrderSteps.signWith === 'loopr' || placeOrderSteps.signWith === 'upWallet') {
    signResult = signByLooprStep(placeOrderSteps, circulrNotify)
  } else {
    signResult = error ? 3 : 2
  }
  let succDesc = '', failedDesc = ''
  switch(placeOrderSteps.task) {
    case 'sign':
      succDesc = intl.get('sign.submit_success')
      failedDesc = intl.get('sign.submit_failed')
      break;
    case 'cancelOrder':
      succDesc = intl.get('sign.cancel_success')
      failedDesc = intl.get('sign.cancel_failed')
      break;
    case 'convert':
      succDesc = intl.get('sign.convert_success')
      failedDesc = intl.get('sign.convert_failed')
      break;
    default:
      throw new Error(`Unsupported task type:${placeOrderSteps.task}`)
  }
  const back = () => {
    if(placeOrderSteps.task === 'sign') {
      dispatch({type:'layers/hideLayer', payload:{id:'placeOrderSteps'}})
    }
    dispatch({type:'layers/hideLayer', payload:{id:'helperOfSignStepPC'}})
  }
  return (
    <div className="bg-white-light">
        {
          signResult === 2 &&
          <div className="text-center p35 pb50">
            <i className={`fs50 icon-success color-success`}></i>
            <div className="fs18 color-black-1 mb15">{succDesc}</div>
            <div className="mt25 text-center">
              <Button className="h-35 fs14 center-center m-auto" style={{width:'75%'}} type="primary" size="small" onClick={back}>{intl.get('common.back')}</Button>
            </div>
          </div>
        }
        {
          signResult === 3 &&
          <div className="text-center p35">
            <Icon type="close-circle" className="fs50 color-error" />
            <div className="fs18 mt15 mb10 color-black-1">{failedDesc}</div>
            {error && <Alert message={error} size="small" type="error" theme="light" icon={false}/>}
            {false && <div className="mt10">
              <Button className="m5 h-35" type="primary" onClick={gotToTrade}> {intl.get('place_order_result.back_to_trade')} </Button>
            </div>}
          </div>
        }
    </div>
  );
};

function mapToProps(state) {
  return {
    placeOrderSteps: state.placeOrderSteps,
    circulrNotify:state.sockets.circulrNotify,
    wallet:state.wallet
  }
}

export default connect(mapToProps) (PlaceOrderResult);



