import React from 'react';
import {Alert, Button, Icon} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import routeActions from 'common/utils/routeActions';

const PlaceOrderResult = (props) => {
  const {placeOrderSteps, dispatch} = props
  const {step, signResult, error} = placeOrderSteps
  const gotToTrade = () => {
    dispatch({type:'layers/hideLayer', payload:{id:'placeOrderSteps'}})
    dispatch({type:'layers/hideLayer', payload:{id:'helperOfSignStepPC'}})
    routeActions.gotoPath('/trade2');
  }
  return (
    <div className="zb-b">
        {
          step === 2 && signResult === 1 &&
          <div className="text-center p35">
            <i className={`fs50 icon-success`}></i>
            <div className="fs18">{intl.get('sign.submit_success')}</div>
            {false && <div className="mt10">
              <Button className="m5" type="default"> {intl.get('place_order_result.view_order')} </Button>
              <Button className="m5" type="default" onClick={gotToTrade}> {intl.get('place_order_result.continue_place_order')} </Button>
            </div>}
          </div>
        }
        {
          step === 2 && signResult === 2 &&
          <div className="text-center p35">
            <Icon type="close-circle" className="fs50 text-error" />
            <div className="fs18 mt15 mb10">{intl.get('sign.submit_failed')}</div>
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
    wallet:state.wallet
  }
}

export default connect(mapToProps) (PlaceOrderResult);



