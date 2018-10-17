import React from 'react';
import {Button, Collapse, Form, Icon, Input} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'
import eachLimit from 'async/eachLimit';
import * as uiFormatter from 'modules/formatter/common'

const PlaceOrderSign = (props) => {
  const {placeOrderSteps, wallet, dispatch} = props
  const {step, signWith, unsign, signed} = placeOrderSteps
  let actualSigned = signed && wallet ? signed.filter(item => item !== undefined && item !== null) : []
  let submitDatas = signed && unsign.length === actualSigned.length ? (
    signed.map((item, index) => {
      return {signed: item, unsigned:unsign[index], index}
    })
  ) : new Array()

  async function sign(item, index, e) {
    e.preventDefault()
    e.stopPropagation()
    try {
      let toConfirmWarn = ''
      if (wallet.unlockType === 'ledger') {
        toConfirmWarn = intl.get('notifications.message.confirm_warn_ledger')
      }
      if (wallet.unlockType === 'metaMask') {
        toConfirmWarn = intl.get('notifications.message.confirm_warn_metamask')
      }
      if(toConfirmWarn) {
        Notification.open({
          message: intl.get('notifications.title.to_confirm'),
          description: toConfirmWarn,
          type: 'info'
        })
      }
      if(item.type === 'order') {
        const signedOrder = await window.WALLET.signOrder(item.data)
        if(signedOrder.r) {
          signedOrder.powNonce = 100;
          signed[index] = {type: 'order', data:signedOrder};
        } else {
          throw new Error('Failed sign order with MetaMask');
        }
      } else {
        const signedTx = await window.WALLET.signEthereumTx(item.data)
        signed[index] = {type: 'tx', data: signedTx};
      }
      dispatch({type:'placeOrderSteps/signedChange',payload:{signed}})
    } catch(e) {
      console.error(e)
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: e.message
      });
    }
  }

  function UserError(message) {
    this.message = message;
  }

  async function doSubmit() {
    if(submitDatas.length === 0) {
      Notification.open({
        message: intl.get('notifications.title.place_order_failed'),
        type: "error",
        description: intl.get('notifications.message.some_items_not_signed')
      });
      return
    }
    eachLimit(submitDatas, 1, async function (item, callback) {
      const signedItem = item.signed
      const unsignedItem = item.unsigned
      //TODO order, approve, cancelOrder, convert, cancelTx, resendTx, transfer
      if(signedItem.type === 'tx') {
        const response = await window.ETH.sendRawTransaction(signedItem.data)
        // console.log('...tx:', response, signedItem)
        if (response.error) {
          callback(new UserError(response.error.message))
        } else {
          signed[item.index].txHash = response.result
          window.RELAY.account.notifyTransactionSubmitted({txHash: response.result, rawTx:unsignedItem.data, from: wallet.address});
          callback()
        }
      } else {
        const response = await window.RELAY.order.placeOrder(signedItem.data)
        if (response.error) {
          callback(new UserError(response.error.message))
        } else {
          signed[item.index].orderHash = response.result
          callback()
        }
      }
    }, function (error) {
      if(error){
        dispatch({type:'placeOrderSteps/signed', payload: {signResult:2, error:error.message}})
      } else {
        dispatch({type:'placeOrderSteps/signed', payload: {signResult:1, error:''}})
      }
    });
  }

  async function handelSubmit() {
    if(!signed || unsign.length !== actualSigned.length) {
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: 'to sign'
      });
      return
    }
    if(unsign.length > 0 && unsign.length !== actualSigned.length) {
      Notification.open({
        message: intl.get('notifications.title.place_order_failed'),
        type: "error",
        description: intl.get('notifications.message.some_items_not_signed')
      });
      return
    }
    await doSubmit()
  }

  const Description = ({tx}) => {
    if(tx.type === 'order') {
      return intl.get('place_order_sign.type_sign_order')
    } else if(tx.type === 'tx') {
      if(tx.action === 'CancelAllowance') {
        return intl.get('place_order_sign.type_cancel_allowance', {token:tx.token})
      } else if (tx.action === 'ApproveAllowance') {
        return intl.get('place_order_sign.type_approve', {token:tx.token})
      }
    }
    return ''
  };

  const TxHeader = ({tx,index})=>{
    return (
      <div className="row pl0 pr0 align-items-center">
        <div className="col">
          <div className="fs14 color-black-2">
            <Button type="primary" shape="circle" size="small" className="mr10">{index+1}</Button>
            <Description tx={tx}/>
          </div>
        </div>
        <div className="col-auto pr20">
          {signed[index] &&
          <div className="text-up">
            {intl.get('place_order_sign.signed')} <Icon className="ml5" type="check-circle"  />
          </div>
          }
          {!signed[index] &&
          <div className="color-black-3">
            <a onClick={sign.bind(this, tx, index)}>{intl.get('place_order_sign.unsigned')}<Icon className="ml5" type="right"  /></a>
          </div>
          }
        </div>
      </div>
    )
  }
  const TxContent = ({tx,index})=>{
    return (
      <div className="row p5 zb-b-t">
        <div className="col-6 pr5">
          <div className="fs12 color-black-2 mt5">{intl.get('place_order_sign.unsigned_tx')}</div>
          <Input.TextArea disabled placeholder="" className="fs12 lh20 border-none" autosize={{ minRows: 6, maxRows: 10 }} value={JSON.stringify(unsign[index])}/>
        </div>
        <div className="col-6 pl5">
          <div className="fs12 color-black-2 mt5">{intl.get('place_order_sign.signed_tx')}</div>
          <Input.TextArea disabled placeholder="" className="fs12 lh20 border-none" autosize={{ minRows: 6, maxRows: 10 }} value={signed && signed[index] ? JSON.stringify(signed[index]) : ''}/>
        </div>
      </div>
    )
  }

  return (
    <div className="zb-b">
      <Collapse accordion bordered={false} defaultActiveKey={[]}>
        {
          unsign && unsign.map((item, index)=>{
            return (
              <Collapse.Panel  header={<TxHeader tx={item} index={index} />} key={index} showArrow={false}>
                <TxContent tx={item} index={index}/>
              </Collapse.Panel>
            )
          })
        }
      </Collapse>
      <div className="p10">
        <Button className="w-100 d-block" size="large" type="primary" onClick={handelSubmit} disabled={!signed || !unsign || unsign.length !== actualSigned.length}> {intl.get('actions.submit')} </Button>
      </div>

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


