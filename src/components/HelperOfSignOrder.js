import React from 'react';
import {Button, Collapse, Form, Icon, Input} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'
import eachLimit from 'async/eachLimit';
import * as uiFormatter from 'modules/formatter/common'

const PlaceOrderSign = (props) => {
  const {placeOrderSteps, wallet, dispatch} = props
  const {step, originOrder} = placeOrderSteps

  async function doSubmit() {
    dispatch({
      type: 'task/setTask',
      payload: {task: 'placeOrder', data: originOrder}
    })
  }

  const TxContent = ()=>{
    return (
      <div className="row p5 zb-b-t">
        <div className="col-6 pr5">
          <div className="fs12 color-black-2 mt5">{intl.get('place_order_sign.unsigned_tx')}</div>
          <Input.TextArea disabled placeholder="" className="fs12 lh20 border-none" autosize={{ minRows: 6, maxRows: 10 }} value={JSON.stringify(originOrder)}/>
        </div>
      </div>
    )
  }

  return (
    <div className="zb-b">
      {
        step === 1 && originOrder &&
          <div>
            <TxContent />
            <div className="p10">
              <Button className="w-100 d-block" size="large" type="primary" onClick={doSubmit} > {intl.get('actions.submit_order')} </Button>
            </div>
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

export default Form.create()(connect(mapToProps)(PlaceOrderSign));


