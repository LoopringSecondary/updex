import React from 'react';
import {Collapse, Form, Icon, Input} from 'antd'
import {Button, NavBar, Toast} from 'antd-mobile'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'
import eachLimit from 'async/eachLimit';
import * as uiFormatter from 'modules/formatter/common'
import storage from 'modules/storage'
import { toHex } from 'LoopringJS/common/formatter'
import {signTx, signMessage, signOrder} from 'common/utils/signUtils'

class SignMessages extends React.Component {

  render(){
    const {sign, dispatch} = this.props
    const {unsigned, signed, qrcode} = sign
    let actualSigned = signed ? signed.filter(item => item !== undefined && item !== null) : []
    let submitDatas = signed && unsigned.length === actualSigned.length ? (
      signed.map((item, index) => {
        return {type:item.type, signed: item, unsigned:unsigned[index], index}
      })
    ) : new Array()

    async function signInfo(item, index, e) {
      try {
        let signResult = {}
        switch(item.type) {
          case 'order':
            const result = await signOrder(item.data)
            if(result.error) {
              throw result.error.message
            }
            signResult = {...item.data, ...result.result, powNonce:100}
            break;
          case 'cancelOrder':
            const timestamp = item.data.timestamp
            const cancelOrder = await signMessage(timestamp)
            if(cancelOrder.error) {
              throw cancelOrder.error.message
            }
            signResult = {sign:{...cancelOrder.result, owner:window.Wallet.address, timestamp}, ...item.data};
            break;
          case 'approve':
          case 'approveZero':
          case 'convert':
          case 'resendTx':
          case 'transfer':
            const txResult = await signTx(item.data)
            if(txResult.error) {
              throw txResult.error.message
            }
            signResult = {...item.data, rawTx:txResult.result}
            break;
          default:
            throw new Error(`Unsupported sign type:${item.type}`)
        }
        signed[index] = {type: item.type, data:signResult};
        dispatch({type:'sign/signedChange',payload:{signed}})
      } catch(e) {
        Toast.fail(e, 10, null, false)
      }
    }

    function UserError(message) {
      this.message = message;
    }

    async function handelSubmit() {
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
              callback(new UserError(cancelRes.error.message))
            }
            break;
          case 'approve':
          case 'approveZero':
          case 'convert':
          case 'resendTx':
          case 'transfer':
            const txRes = await window.ETH.sendRawTransaction(signedItem.data.rawTx)
            // console.log('...tx:', response, signedItem)
            if (txRes.error) {
              callback(new UserError(txRes.error.message))
            } else {
              signed[item.index].txHash = txRes.result
              window.RELAY.account.notifyTransactionSubmitted({txHash: txRes.result, rawTx:unsignedItem.data, from: window.Wallet.address});
              callback()
            }
            break;
          default:
            throw new Error(`Unsupported sign type:${item.type}`)
        }
      }, function (error) {
        if(error){
          Toast.fail(error.message, 3, null, false)
          window.RELAY.account.notifyCircular({
            "owner" : window.Wallet.address,
            "body" : {hash: qrcode.value, "status" : "txFailed"}
          })
        } else {
          Toast.success(intl.get('notifications.title.operation_succ'), 3, null, false)
          dispatch({type: 'layers/hideLayer', payload: {id:'signMessages'}})
          window.RELAY.account.notifyCircular({
            "owner" : window.Wallet.address,
            "body" : {hash: qrcode.value, "status" : "accept"}
          })
        }
      });
    }

    const Description = ({tx}) => {
      let type = tx.type
      if(type === 'tx' && tx.title) {
        type = tx.title
      }
      switch(type) {
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
              <Button className="cursor-pointer fs12 h-25 lh-25" type="primary" size="small" onClick={signInfo.bind(this, tx, index)}>{intl.get('actions.sign')}</Button>
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
            <span className="color-black-1"><Icon key="1" type="close" /></span>,
          ]}
          rightContent={[]}
        >
          {intl.get('sign.title')}
        </NavBar>
        <div className="divider 1px zb-b-b"></div>
        <div className="bg-white p15" style={{minHeight:'10rem',borderRadius:'0rem'}}>
          {
            unsigned && unsigned.map((item, index)=><MessageItem key={index} tx={item} index={index} />)
          }
          <Button className="w-100 d-block mt15 mb0" size="" type="primary" onClick={handelSubmit} disabled={!signed || !unsigned || unsigned.length !== actualSigned.length}> {intl.get('actions.submit')} </Button>
        </div>
      </div>
    );
  }

};

function mapToProps(state) {
  return {
    sign: state.sign,
  }
}

export default Form.create()(connect(mapToProps)(SignMessages));
