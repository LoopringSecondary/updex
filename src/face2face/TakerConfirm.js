import React from 'react'
import config from '../common/config'
import { toHex, toBig, toFixed,clearHexPrefix ,toNumber} from 'LoopringJS/common/formatter'
import monent from 'moment'
import { Icon } from 'antd'
import { Button } from 'antd-mobile'
import storage from 'modules/storage'
import Contracts from 'LoopringJS/ethereum/contracts/Contracts'
import { connect } from 'dva'
import { signTx,signOrder } from '../common/utils/signUtils'
import { Toast } from 'antd-mobile/lib/index'
import intl from 'react-intl-universal'
import { createWallet } from 'LoopringJS/ethereum/account'
import Notification from 'LoopringUI/components/Notification'
import * as orderFormatter from 'modules/orders/formatters'
import eachOfLimit from "async/eachOfLimit";
import TokenFm from 'modules/tokens/TokenFm'



const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pl0 pr0 zb-b-t no-gutters" style={{padding: '7px 0px'}}>
      <div className="col">
        <div className="fs14 color-black-1 lh25 text-left">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs14 color-black-2 text-wrap lh25 text-left">{value}</div>
      </div>
    </div>
  )
}

class TakerConfirm extends React.Component {

  render () {
    const {dispatch, takerConfirm, gas,balance,pendingTx} = this.props
    const {makerOrder} = takerConfirm
    const validSince = monent()
    const validUntil = validSince.add(1, 'days')
    const order = {}
    order.delegateAddress = makerOrder.originalOrder.delegateAddress
    order.protocol = makerOrder.originalOrder.protocol
    order.owner = (window.Wallet && window.Wallet.address) || storage.wallet.getUnlockedAddress()
    order.tokenB = makerOrder.originalOrder.tokenS
    order.tokenS = makerOrder.originalOrder.tokenB
    order.amountB = toHex(toBig(makerOrder.originalOrder.amountS).idiv(makerOrder.count))
    let amountS = toBig(makerOrder.originalOrder.amountB).div(makerOrder.count)
    if (!amountS.isInteger()) {
      amountS = toBig(makerOrder.originalOrder.amountB).idiv(makerOrder.count).plus(1)
    }
    order.amountS = toHex(amountS)
    order.lrcFee = '0x0'
    order.validSince = toHex(Math.ceil(validSince.valueOf() / 1e3))
    order.validUntil = toHex(Math.ceil(validUntil.valueOf() / 1e3))
    order.marginSplitPercentage = 0
    order.buyNoMoreThanAmountB = true
    order.walletAddress = config.getWalletAddress()
    const authAccount = createWallet()
    order.authAddr = authAccount.getAddressString();
    order.authPrivateKey = clearHexPrefix(authAccount.getPrivateKeyString());
    order.orderType = 'p2p_order'

    const tokensFm = new TokenFm({symbol:order.tokenS})
    const tokenbFm = new TokenFm({symbol:order.tokenB})

    const price = toFixed(order.amountS / order.amountB, 4);
    const showLayer = (payload = {}) => {
      dispatch({
        type: 'layers/showLayer',
        payload: {
          ...payload
        }
      })
    }
    const hideLayer = (payload = {}) => {
      dispatch({
        type: 'layers/hideLayer',
        payload: {
          ...payload
        }
      })
    }

    const submitRing = async () => {
      const address = (window.Wallet && window.Wallet.address) || storage.wallet.getUnlockedAddress()
      const gasPrice = toHex(toBig(gas.tabSelected === 'estimate' ? gas.gasPrice.estimate : gas.gasPrice.current))
      const tradeInfo = {...order,roleType:'taker',validSince:validSince.unix(),validUntil:validUntil.unix(),milliLrcFee:0,amountS:tokensFm.getUnitAmount(order.amountS),amountB:tokenbFm.getUnitAmount(order.amountB),gasLimit:config.getGasLimitByType('approve').gasLimit,gasPrice}
      try {
        await orderFormatter.p2pVerification(balance, tradeInfo, pendingTx ? pendingTx.items : [], gasPrice)
      } catch (e) {
        Notification.open({
          message: intl.get('notifications.title.place_order_failed'),
          description: e.message,
          type: 'error'
        })
        dispatch({type: 'p2pOrder/loadingChange', payload: {loading: false}})
        return
      }
      console.log(JSON.stringify(tradeInfo.error))
      console.log(JSON.stringify(tradeInfo.warn))

      if (tradeInfo.error) {
        tradeInfo.error.map(item => {
            Notification.open({
              message: intl.get('notifications.title.place_order_failed'),
              description: intl.get('notifications.message.token_required_when_place_order', {required: item.value.required,token:item.value.symbol}),
              type: 'error',
              actions: (
                <div>
                  <Button className="alert-btn mr5" onClick={() => dispatch({
                    type: 'layers/showLayer',
                    payload: {id: 'receiveToken', symbol: item.value.symbol}
                  })}>
                    {`${intl.get('actions.receive')} ${item.value.symbol}`}
                  </Button>
                </div>
              )
            })
        })
        dispatch({type: 'p2pOrder/loadingChange', payload: {loading: false}})
        return
      }

      try {
        const {unsigned} = await orderFormatter.signP2POrder(tradeInfo, (window.Wallet && window.Wallet.address) || storage.wallet.getUnlockedAddress())
        const signResult = await signOrder(order)
        if (signResult.error) {
          Notification.open({
            message: intl.get('notifications.title.place_order_failed'),
            description: signResult.error.message,
            type: 'error'
          })
          return
        }
        const signedOrder = {...order, ...signResult.result}
        signedOrder.powNonce = 100
       const txs = unsigned.filter(item => item.type === 'tx')

        eachOfLimit(txs, 1, async (item) => {
          signTx(item.data).then(res => {
            if (res.result) {
              window.ETH.sendRawTransaction(res.result).then(resp => {
                if (resp.result) {
                  window.RELAY.account.notifyTransactionSubmitted({
                    txHash: resp.result,
                    rawTx: item.data,
                    from: window.Wallet.address
                  })
                }
              })
            }
          })
        }, async function (e) {
          if (e) {
            Notification.open({
              message: intl.get('notifications.title.place_order_failed'),
              description: e.message,
              type: 'error'
            })
          }else{
            const nonce = txs.length >0 ? toHex(toNumber(txs[txs.length -1].nonce) + 1) :toHex((await window.RELAY.account.getNonce(address)).result)
            const tx = {
              value: '0x0',
              gasLimit: config.getGasLimitByType('submitRing').gasLimit,
              chainId: config.getChainId(),
              to: order.protocol,
              gasPrice,
              nonce,
            data:Contracts.LoopringProtocol.encodeSubmitRing([{...order,...signedOrder},makerOrder.originalOrder],config.getWalletAddress())
          };
            signTx(tx).then(res => {
              if (res.result) {
                window.RELAY.ring.submitRingForP2P({makerOrderHash:makerOrder.originalOrder.hash,rawTx:res.result,takerOrderHash:window.RELAY.order.getOrderHash(order)}).then(resp => {
                  if (resp.result) {
                    Toast.success(intl.get('notifications.title.submit_ring_suc'), 3, null, false)
                    hideLayer({id: 'takerConfirm'})
                  } else {
                    Toast.fail(intl.get('notifications.title.submit_ring_fail') + ':' + resp.error.message, 3, null, false)
                  }
                })
              } else {
                Toast.fail(intl.get('notifications.title.submit_ring_fail') + ':' + res.error.message, 3, null, false)
              }
            })
          }
        })
      } catch (e) {
        Notification.open({
          message: intl.get('notifications.title.place_order_failed'),
          description: e.message,
          type: 'error'
        })
      }
    }

    return (
      <div>
        <div className="p15 color-black-1 fs18 zb-b-b text-center">
          <div className="row">
            <div className="col-auto text-left" onClick={hideLayer.bind(this, {id: 'takerConfirm'})}>
              <Icon type="close"/>
            </div>
            <div className="col">Place Order</div>
            <div className="col-auto color-white">
              <Icon type="close"/>
            </div>
          </div>
        </div>
        <div className="p20 bg-white">
          <div className="pb20 row ml0 mr0 no-gutters align-items-center justify-content-center">
            <div className="col-auto">
              <div className=" color-black-1 text-center" style={{
                width: '40px',
                height: '40px',
                lineHeight: '38px',
                borderRadius: '50em',
                border: '1px solid #000'
              }}>
                <i className={`icon-${order.tokenS} fs24`}/>
              </div>
            </div>
            <div className="col-auto pl25 pr25 text-center">
              <Icon type="swap" className={`color-black-1 fs20`}/>
            </div>
            <div className="col-auto">
              <div className="color-black-1 text-center" style={{
                width: '40px',
                height: '40px',
                lineHeight: '38px',
                borderRadius: '50em',
                border: '1px solid #000'
              }}>
                <i className={`icon-${order.tokenB} fs24`}/>
              </div>
            </div>
          </div>
          <OrderMetaItem label={intl.get('common.price')} value={`${price} ${order.tokenS}/${order.tokenB}`}/>
          <OrderMetaItem label={intl.get('common.sell')} value={`${tokensFm.getUnitAmount(order.amountS)} ${order.tokenS} `}/>
          <OrderMetaItem label={intl.get('common.buy')} value={`${tokenbFm.getUnitAmount(order.amountB)} ${order.tokenB} `}/>
          <OrderMetaItem label={intl.get('common.ttl')}
                         value={`${validSince.format('MM-DD HH:mm')} ~ ${validUntil.format('MM-DD HH:mm')}`}/>
          <Button type="" className="bg-grey-900 color-white mt15" onClick={() => {submitRing()}}>签名</Button>
        </div>
      </div>
    )
  }

}

function mapStatetoProps (state) {

  return {
    gas: state.gas,
    balance: state.sockets.balance.items,
    pendingTx: state.pendingTx
  }
}

export default connect(mapStatetoProps)(TakerConfirm)
