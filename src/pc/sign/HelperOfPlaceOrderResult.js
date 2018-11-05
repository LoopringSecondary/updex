import React from 'react';
import {Alert, Button, Icon} from 'antd'
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
  }
  return (
    <div className="bg-white-light">
        {
          signResult === 2 &&
          <div className="text-center p35">
            <i className={`fs50 icon-success color-success`}></i>
            <div className="fs18 color-black-1">{intl.get('sign.submit_success')}</div>
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
    circulrNotify:state.sockets.circulrNotify,
    wallet:state.wallet
  }
}

export default connect(mapToProps) (PlaceOrderResult);



