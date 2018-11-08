import React from 'react';
import {Collapse, Form, Icon, Input} from 'antd'
import {Button} from 'antd-mobile'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'
import eachLimit from 'async/eachLimit';
import * as uiFormatter from 'modules/formatter/common'
import storage from 'modules/storage'
import { toHex } from 'LoopringJS/common/formatter'

const SignMessages = (props) => {
  const {placeOrderSteps, p2pOrder, wallet, dispatch} = props
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
        dispatch({type: 'p2pOrder/setFetchOrder', payload: {fetchOrder:true}})
        const order = placeOrderSteps.unsign.find((item) => item.type === 'order')
        if(order && order.completeOrder && order.completeOrder.authPrivateKey) {
          storage.orders.storeP2POrder({
            auth: order.completeOrder.authPrivateKey,
            hash: toHex(window.RELAY.order.getOrderHash(order.completeOrder)),
            count: p2pOrder.count
          })
        }
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
  const MessageItem = ({tx,index})=>{
    return (
      <div className="row pt15 pb15 zb-b-b ml0 mr0 no-gutters align-items-center fs14">
        <div className="col text-left">
          <div className="color-black-1">
            {index+1}.&nbsp;&nbsp;<Description tx={tx}/>
          </div>
        </div>
        <div className="col-auto ">
          {signed[index] &&
          <div className="color-success">
            <Icon className="mr5" type="check-circle" theme="filled"  />{intl.get('place_order_sign.signed')} 
          </div>
          }
          {!signed[index] &&
          <div className="">
            <Button className="cursor-pointer fs12 h-25 lh-25" type="primary" size="small" onClick={sign.bind(this, tx, index)}>{intl.get('place_order_sign.unsigned')}</Button>
          </div>
          }
        </div>
      </div>
    )
  }
  const hideLayer = (payload = {}) => {
    dispatch({
      type: 'layers/hideLayer',
      payload: {
        ...payload
      }
    })
  }
  return (
    <div className="bg-fill">
      <NavBar
        className="bg-white"
        mode="light"
        onLeftClick={() => hideLayer({id:'signMessages'})}
        leftContent={[
          <span className="color-black-1"><WebIcon key="1" type="close" /></span>,
        ]}
        rightContent={null && [
          <span className="color-black-1 " onClick={()=>{}}><WebIcon key="1" type="info-circle-o" /></span>
        ]}
      >
      Sign Messages
      </NavBar>
      <div className="bg-white p15" style={{minHeight:'10rem',borderRadius:'0rem'}}>
        <div className="color-black-3 fs14 pb10 zb-b-b">You Need To Do </div>
        {
          unsign && unsign.map((item, index)=><MessageItem key={index} tx={item} index={index} />)
        }
        <Button className="w-100 d-block mt30 mb0" size="" type="primary" onClick={handelSubmit} disabled={!signed || !unsign || unsign.length !== actualSigned.length}> {intl.get('actions.submit')} </Button>
      </div>
    </div>
  );
};

function mapToProps(state) {
  return {
    placeOrderSteps: state.placeOrderSteps,
    p2pOrder: state.p2pOrder,
    wallet:state.wallet
  }
}

export default Form.create()(connect(mapToProps)(SignMessages));