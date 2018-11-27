import React from 'react';
import {Collapse, Form, Icon, Input} from 'antd'
import {Button, Toast,NavBar} from 'antd-mobile'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'
import eachLimit from 'async/eachLimit';
import * as uiFormatter from 'modules/formatter/common'
import storage from 'modules/storage'
import { toHex, toNumber, toBig } from 'LoopringJS/common/formatter'
import {signTx, signOrder} from '../common/utils/signUtils'
import config from "../common/config";
import Contracts from 'LoopringJS/ethereum/contracts/Contracts'


class PlaceOrderSign extends React.Component {

  state = {
    enableSubmitRing:false,
  }

  SubmitRingRawTx = async (unsigned, makerOrder, signedTakerOrder, gasPrice) => {
    const txs = unsigned.filter(item => item.type === 'tx');
    const nonce = txs.length > 0 ? toHex(toNumber(txs[txs.length - 1].data.nonce) + 1) : toHex((await window.RELAY.account.getNonce(signedTakerOrder.data.owner)).result)
    return {
      value: '0x0',
      gasLimit: config.getGasLimitByType('submitRing').gasLimit,
      chainId: config.getChainId(),
      to: signedTakerOrder.data.protocol,
      gasPrice,
      nonce,
      data: Contracts.LoopringProtocol.encodeSubmitRing([{...signedTakerOrder.data}, {
        ...makerOrder.originalOrder,
        tokenS: config.getTokenBySymbol(makerOrder.originalOrder.tokenS).address,
        tokenB: config.getTokenBySymbol(makerOrder.originalOrder.tokenB).address,
        owner: makerOrder.originalOrder.address,
        marginSplitPercentage: toNumber(makerOrder.originalOrder.marginSplitPercentage)
      }], signedTakerOrder.data.owner)
    };
  }

  render() {
    const {placeOrderSteps, gas, balance, pendingTx, takerConfirm, dispatch} = this.props
    const address = (window.Wallet && window.Wallet.address) || storage.wallet.getUnlockedAddress()
    const gasPrice = toHex(toBig(gas.tabSelected === 'estimate' ? gas.gasPrice.estimate : gas.gasPrice.current).times(1e9))
    const {unsign, makerOrder, signed} = placeOrderSteps
    const takerOrderSigned = signed.find((n) => n && n.type === 'order')
    let submitRingRawTx = unsign.find((n) => n.type === 'submitRing') || {}
    if(takerOrderSigned) {
      this.SubmitRingRawTx(unsign, makerOrder, takerOrderSigned, gasPrice).then(resp => {
        submitRingRawTx.data = resp
        unsign.forEach(item => {
          if(item.type === 'submitRing') {
            item.data = resp
          }
        })
      })
    }
    if(signed && signed.filter(item=>item && item !== null).length === unsign.filter(item=>item.type !== 'submitRing').length && !this.state.enableSubmitRing) {
      this.setState({enableSubmitRing:true})
    }
    let actualSigned = signed ? signed.filter(item => item !== undefined && item !== null) : []
    let submitDatas = signed ? (
      signed.map((item, index) => {
        return {type:item.type, signed: item, unsigned:unsign[index], index}
      })
    ) : new Array()

    async function sign(item, index, e) {
      e.preventDefault()
      e.stopPropagation()
      try {
        let signResult = {}
        let type = item.type
        if(item.type === 'tx' && item.title) {
          type = item.title
        }
        if(type === 'submitRing') {
          // doSubmit()
          signAndDoSubmit()
        } else {
          switch(type) {
            case 'order':
              const resp = await signOrder(item.completeOrder)
              if (resp.error) {
                throw resp.error.message
              }
              signResult = {...item.completeOrder, ...resp.result, powNonce: 100}
              break;
            case 'approve':
            case 'approveZero':
              const respTx = await signTx(item.data)
              if (respTx.error) {
                throw respTx.error.message
              }
              signResult = respTx.result //rawTx
              break;
            default:
              throw new Error(`Unsupported sign type:${item.type}`)
          }
          signed[index] = {type: item.type, data:signResult};
          dispatch({type:'placeOrderSteps/signedChange',payload:{signed}})
        }
      } catch(e) {
        console.error(e)
        Notification.open({
          message: intl.get('sign.signed_failed'),
          type: "error",
          description: e
        });
      }
    }

    function UserError(message) {
      this.message = message;
    }

    async function signAndDoSubmit() {
      Toast.loading(intl.get('sign.submitting'), 0, null, false);
      signTx(submitRingRawTx.data).then(signSubmitRing => {
        if (signSubmitRing.result) {
          const txs = submitDatas.filter(item => item.type === 'tx');
          eachLimit(txs, 1, async function (item, callback) {
            const signedItem = item.signed
            const unsignedItem = item.unsigned
            const txRes = await window.ETH.sendRawTransaction(signedItem.data)
            // console.log('...tx:', response, signedItem)
            if (txRes.error) {
              callback(txRes.error.message)
            } else {
              signed[item.index].txHash = txRes.result
              window.RELAY.account.notifyTransactionSubmitted({txHash: txRes.result, rawTx:unsignedItem.data, from: address});
              callback()
            }
          }, function (error) {
            if(error){
              Toast.hide();
              Toast.fail(error, 3, null, false)
            } else {
              window.RELAY.order.placeOrderForP2P({...takerOrderSigned.data, authPrivateKey: ''}, makerOrder.originalOrder.hash).then(placeOrder=>{
                if (placeOrder.error) {
                  Toast.hide();
                  Toast.fail(placeOrder.error.code ? intl.get('common.errors.' + placeOrder.error.message) : placeOrder.error.message, 3, null, false)
                } else {
                  window.RELAY.ring.submitRingForP2P({makerOrderHash: makerOrder.originalOrder.hash, rawTx: signSubmitRing.result, takerOrderHash:placeOrder.result}).then(submitRing=> {
                    if (submitRing.result) {
                      Toast.hide();
                      Toast.success(intl.get('notifications.title.submit_ring_suc'), 3, null, false)
                      dispatch({type: 'layers/hideLayer', payload: {id: 'helperOfSign'}})
                      dispatch({type: 'layers/hideLayer',payload: {id:'takerConfirm'}})
                      dispatch({type: 'p2pOrder/setFetchOrder', payload: {fetchOrder: true}});
                      window.RELAY.account.notifyTransactionSubmitted({
                        txHash: submitRing.result,
                        rawTx: takerOrderSigned.data,
                        from: address
                      })
                    } else {
                      Toast.hide();
                      Toast.fail(submitRing.error.code ? intl.get('common.errors.' + submitRing.error.message) : submitRing.error.message, 3, null, false)
                    }
                  })
                }
              })
            }
          });
        } else {
          throw intl.get('notifications.title.submit_ring_fail') + ':' + signSubmitRing.error.message
        }
      }).catch(e=>{
        Toast.hide();
        Toast.fail(e, 3, null, false)
      })
    }

    // async function handelSubmit() {
    //   if(!signed || unsign.length !== actualSigned.length) {
    //     Notification.open({
    //       message: intl.get('sign.signed_failed'),
    //       type: "error",
    //       description: 'to sign'
    //     });
    //     return
    //   }
    //   if(unsign.length > 0 && unsign.length !== actualSigned.length) {
    //     Notification.open({
    //       message: intl.get('sign.signed_failed'),
    //       type: "error",
    //       description: intl.get('notifications.message.some_items_not_signed')
    //     });
    //     return
    //   }
    //   await doSubmit()
    // }

    const Description = ({tx}) => {
      switch(tx.type) {
        case 'tx':
          if(tx.title === 'approve') {
            return intl.get('sign.type_approve', {token:tx.token})
          } else if(tx.title === 'approveZero') {
            return intl.get('sign.type_cancel_allowance', {token:tx.token})
          }
          return ''
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
        case 'submitRing':
          return intl.get('sign.type_submit_ring')
        default:
          return ''
      }

    };
    return (
      <div className="bg-white">
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={() =>  dispatch({type: 'layers/hideLayer', payload: {id: 'helperOfSign'}}) }
          leftContent={[
            <span className="text-primary center-center fs14" key="1"><Icon type="close" /></span>,
          ]}
          rightContent={[]}
        >
          {intl.get('sign.title')}
        </NavBar>
        <div className="divider 1px zb-b-b"></div>
        <div className="bg-white-light p15" style={{minHeight:'35vh',borderRadius:'0rem'}}>
          {
            unsign && unsign.map((item, index)=>{
              return (
                <div className="row pt15 pb15 zb-b-b ml0 mr0 no-gutters align-items-center fs14">
                  <div className="col text-left">
                    <div className="color-black-1 fs16">
                      {index+1}.&nbsp;&nbsp;<Description tx={item}/>
                    </div>
                  </div>
                  <div className="col-auto ">
                    {signed[index] &&
                    <div className="color-success">
                      <Icon className="mr5" type="check-circle" theme="filled"  />{intl.get('sign.signed')}
                    </div>
                    }
                    {!signed[index] &&
                    <div className="">
                      {
                        item.type === 'submitRing' &&
                        <Button className="cursor-pointer fs12 h-35 center-center pl15 pr15" type="primary" size="small" disabled={!this.state.enableSubmitRing} onClick={sign.bind(this, item, index)}>{intl.get('sign.sign_and_submit')}</Button>
                      }
                      {
                        item.type !== 'submitRing' &&
                        <Button className="cursor-pointer fs12 h-35 center-center pl15 pr15" type="primary" size="small" onClick={sign.bind(this, item, index)}>{intl.get('sign.unsigned')}</Button>
                      }
                    </div>
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}

function mapToProps(state) {
  return {
    placeOrderSteps: state.placeOrderSteps,
    gas:state.gas,
    balance: state.sockets.balance.items,
    pendingTx: state.sockets.pendingTx,
  }
}

export default Form.create()(connect(mapToProps)(PlaceOrderSign));


