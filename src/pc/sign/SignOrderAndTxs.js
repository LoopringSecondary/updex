import React from 'react';
import {Collapse, Form, Icon, Input} from 'antd'
import {Button} from 'antd-mobile'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'
import eachLimit from 'async/eachLimit';
import * as uiFormatter from 'modules/formatter/common'

const PlaceOrderSign = (props) => {
  const {placeOrderSteps, wallet, dispatch} = props
  const {unsign, signed} = placeOrderSteps
  let actualSigned = signed && wallet ? signed.filter(item => item !== undefined && item !== null) : []
  let submitDatas = signed && unsign.length === actualSigned.length ? (
    signed.map((item, index) => {
      return {type:item.type, signed: item, unsigned:unsign[index], index}
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
      let signResult = {}
      switch(item.type) {
        case 'order':
          signResult = await window.WALLET.signOrder(item.data)
          signResult.powNonce = 100;
          break;
        case 'cancelOrder':
          const timestamp = item.data.timestamp
          const cancelOrder = await window.WALLET.signMessage(timestamp)
          const owner = await window.WALLET.getAddress()
          signResult = {sign:{...cancelOrder, owner, timestamp}, ...item.data};
          break;
        case 'approve':
        case 'approveZero':
        case 'convert':
        case 'resendTx':
        case 'transfer':
          signResult = await window.WALLET.signEthereumTx(item.data)
          break;
        default:
          throw new Error(`Unsupported sign type:${item.type}`)
      }
      signed[index] = {type: item.type, data:signResult};
      dispatch({type:'placeOrderSteps/signedChange',payload:{signed}})
    } catch(e) {
      console.error(e)
      Notification.open({
        message: intl.get('sign.signed_failed'),
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
      // order, approve, cancelOrder, convert, cancelTx, resendTx, transfer
      switch(item.type) {
        case 'order':
          const orderRes = await window.RELAY.order.placeOrder(signedItem.data)
          if (orderRes.error) {
            callback(new UserError(orderRes.error.message))
          } else {
            signed[item.index].orderHash = orderRes.result
            callback()
          }
          break;
        case 'cancelOrder':
          const cancelRes = await window.RELAY.order.cancelOrder(signedItem.data)
          if (!cancelRes.error) {
            callback()
          } else {
            callback(cancelRes.error)
          }
          break;
        case 'approve':
        case 'approveZero':
        case 'convert':
        case 'resendTx':
        case 'transfer':
          const txRes = await window.ETH.sendRawTransaction(signedItem.data)
          // console.log('...tx:', response, signedItem)
          if (txRes.error) {
            callback(new UserError(txRes.error.message))
          } else {
            signed[item.index].txHash = txRes.result
            window.RELAY.account.notifyTransactionSubmitted({txHash: txRes.result, rawTx:unsignedItem.data, from: wallet.address});
            callback()
          }
          break;
        default:
          throw new Error(`Unsupported sign type:${item.type}`)
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
        message: intl.get('sign.signed_failed'),
        type: "error",
        description: 'to sign'
      });
      return
    }
    if(unsign.length > 0 && unsign.length !== actualSigned.length) {
      Notification.open({
        message: intl.get('sign.signed_failed'),
        type: "error",
        description: intl.get('notifications.message.some_items_not_signed')
      });
      return
    }
    await doSubmit()
  }

  const Description = ({tx}) => {
    switch(tx.type) {
      case 'order':
        return intl.get('sign.type_sign_order')
      case 'cancelOrder':
        return intl.get('sign.type_cancel_order')
      case 'approve':
        return intl.get('sign.type_approve', {token:tx.token})
      case 'approveZero':
        return intl.get('sign.type_cancel_allowance', {token:tx.token})
      case 'convert':
        return intl.get('sign.type_convert')
      default:
        return ''
    }

  };
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
  const TxHeader = ({tx,index})=>{
    return (
      <div className="row pt15 pb15 zb-b-b ml0 mr0 no-gutters align-items-center">
        <div className="col text-left">
          <div className="fs14 color-black-1">
            {index+1}. <Description tx={tx}/>
          </div>
        </div>
        <div className="col-auto ">
          {signed[index] &&
          <div className="color-success">
            {intl.get('place_order_sign.signed')} <Icon className="ml5" type="check-circle"  />
          </div>
          }
          {!signed[index] &&
          <div className="">
            <a className="text-primary cursor-pointer" onClick={sign.bind(this, tx, index)}>{intl.get('place_order_sign.unsigned')}<Icon className="ml5" type="right"  /></a>
          </div>
          }
        </div>
      </div>
    )
  }
  return (
    <div className="">
      <div className="bg-fill p15" style={{minHeight:'25rem',borderRadius:'0.4rem'}}>
        <div className="color-black-3 fs14 pb10 zb-b-b">You Need To Do </div>
        {
          unsign && unsign.map((item, index)=><TxHeader tx={item} index={index} />)
        }
      </div>
      <div className="mt20">
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


