import React from 'react'
import config from '../common/config'
import {toHex, toBig, toFixed, clearHexPrefix, toNumber} from 'LoopringJS/common/formatter'
import monent from 'moment'
import {Icon} from 'antd'
import {Button, NavBar} from 'antd-mobile'
import storage from 'modules/storage'
import Contracts from 'LoopringJS/ethereum/contracts/Contracts'
import {connect} from 'dva'
import {signTx, signOrder} from '../common/utils/signUtils'
import {Toast} from 'antd-mobile/lib/index'
import intl from 'react-intl-universal'
import {createWallet} from 'LoopringJS/ethereum/account'
import Notification from 'LoopringUI/components/Notification'
import * as orderFormatter from 'modules/orders/formatters'
import eachOfLimit from "async/eachOfLimit";
import TokenFm from 'modules/tokens/TokenFm'
import Worth from 'modules/settings/Worth'
import HelperOfBalances from './HelperOfBalances'


const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pl15 pr15 zb-b-t no-gutters" style={{padding: '7px 0px'}}>
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

  render() {
    const {dispatch, takerConfirm, gas, balance, pendingTx, socket} = this.props
    const {makerOrder} = takerConfirm
    const validSince = monent().subtract(1, 'hours')
    const validUntil = monent().add(2, 'd')
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
    order.lrcFee = '0x0';
    order.validSince = toHex(Math.ceil(validSince.valueOf() / 1e3));
    order.validUntil = toHex(Math.ceil(validUntil.valueOf() / 1e3));
    order.marginSplitPercentage = 0;
    order.buyNoMoreThanAmountB = true;
    order.walletAddress = (storage.wallet.getRewardAddress()) || config.getWalletAddress()
    const authAccount = createWallet();
    order.authAddr = authAccount.getAddressString();
    order.authPrivateKey = clearHexPrefix(authAccount.getPrivateKeyString());
    order.orderType = 'p2p_order'

    const completeOrder = {
      ...order,
      tokenS: config.getTokenBySymbol(order.tokenS).address,
      tokenB: config.getTokenBySymbol(order.tokenB).address
    }
    const tokensFm = new TokenFm({symbol: order.tokenS})
    const tokenbFm = new TokenFm({symbol: order.tokenB})
    const price = toFixed(order.amountS / order.amountB, 4);
    const hideLayer = (payload = {}) => {
      dispatch({
        type: 'layers/hideLayer',
        payload: {
          ...payload
        }
      })
    }

    const submitRing = async () => {
      if (!socket || balance.length === 0) {
        Notification.open({description: intl.get('notifications.message.wait_for_load_data'), type: 'error'});
        return
      }
      const makerOrderErrors = await orderFormatter.verifyMakerOrder(makerOrder.originalOrder, makerOrder.count);
      if (makerOrderErrors.length > 0) {
        const item = makerOrderErrors[0]
        if(item.type === 'sameOwner'){
          Notification.open({
            description: intl.get('common.errors.' + item.value.errorCode),
            type: 'error',
          })
        }

        if (item.type === "BalanceNotEnough") {
          Notification.open({
            description: intl.get('p2p_order.maker_balance_not_enough', {
              required: item.value.required,
              balance: item.value.balance,
              token: item.value.symbol
            }),
            type: 'error',
          })
        }
        if (item.type === "AllowanceNotEnough") {
          Notification.open({
            description: intl.get('p2p_order.maker_allowance_not_enough', {
              required: item.value.required,
              allowance: toNumber(item.value.allowance),
              token: item.value.symbol
            }),
            type: 'error',
          })
        }
        return;
      }

      const address = (window.Wallet && window.Wallet.address) || storage.wallet.getUnlockedAddress()
      const gasPrice = toHex(toBig(gas.tabSelected === 'estimate' ? gas.gasPrice.estimate : gas.gasPrice.current).times(1e9))
      const tradeInfo = {
        ...order,
        marginSplit: 0,
        roleType: 'taker',
        validSince: validSince.unix(),
        validUntil: validUntil.unix(),
        milliLrcFee: 0,
        amountS: tokensFm.getUnitAmount(order.amountS),
        amountB: tokenbFm.getUnitAmount(order.amountB),
        gasLimit: config.getGasLimitByType('approve').gasLimit,
        gasPrice
      }
      try {
        await orderFormatter.p2pVerification(balance, tradeInfo, pendingTx ? pendingTx.items : [], toBig(gasPrice).div(1e9))
      } catch (e) {
        Notification.open({
          message: intl.get('notifications.title.place_order_failed'),
          description: e.message,
          type: 'error'
        })
        dispatch({type: 'p2pOrder/loadingChange', payload: {loading: false}})
        return
      }
      if (tradeInfo.error && tradeInfo.error[0]) {
        const item = tradeInfo.error[0]
        if (item.value.symbol.toLowerCase() === 'eth') {
          Notification.open({
            message: intl.get('notifications.title.place_order_failed'),
            description: intl.get('notifications.message.eth_is_required_when_place_order', {required: item.value.required}),
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
        } else {
          Notification.open({
            message: intl.get('notifications.title.place_order_failed'),
            description: intl.get('notifications.message.token_required_when_place_order', {
              required: item.value.required,
              token: item.value.symbol
            }),
            type: 'error',
          })
        }
        dispatch({type: 'p2pOrder/loadingChange', payload: {loading: false}})
        return
      }
      try {
        const unsigned = await orderFormatter.generateSignData({tradeInfo, order:completeOrder, completeOrder, address}) //[{type:order}, {type:tx}]
        unsigned.push({type: 'submitRing'})
        dispatch({type:'placeOrderSteps/unsign', payload: {task:'sign', unsign:unsigned, makerOrder}})
        dispatch({type: 'layers/showLayer', payload: {id: 'helperOfSign'}})
      } catch (e) {
        Notification.open({
          message: intl.get('notifications.title.place_order_failed'),
          description: e.message,
          type: 'error'
        })
      }
    }

    return (
      <div className="bg-fill" style={{height: '100%',overflow:'auto'}}>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={() => hideLayer({id: 'takerConfirm'})}
          leftContent={[
            <span key='1' className=""><Icon type="close"/></span>,
          ]}
        >
          <div className="color-black-1">{intl.get('p2p_order.order_title')}</div>
        </NavBar>
        <div className="pt20 pb20 bg-white">
          <div className="pb20 row ml0 mr0 no-gutters align-items-center justify-content-center">
            <div className="col-auto">
              <div className="bg-primary-light text-primary circle-50 center-center">
                <i className={`icon-token-${order.tokenS} fs24`}/>
              </div>
            </div>
            <div className="col-auto pl25 pr25 text-center">
              <Icon type="swap" className={`color-black-1 fs20`}/>
            </div>
            <div className="col-auto">
              <div className="bg-primary-light text-primary circle-50 center-center">
                <i className={`icon-token-${order.tokenB} fs24`}/>
              </div>
            </div>
          </div>
          <OrderMetaItem label={intl.get('common.sell')}
                         value={`${tokensFm.toPricisionFixed(tokensFm.getUnitAmount(order.amountS))} ${order.tokenS} `}/>
          <OrderMetaItem label={intl.get('common.buy')}
                         value={`${tokenbFm.toPricisionFixed(tokenbFm.getUnitAmount(order.amountB))} ${order.tokenB} `}/>
          <OrderMetaItem label={intl.get('common.buy') + ' ' + intl.get('order.price')} value={
            <span>
                  {`1 ${order.tokenB} = ${Number(toFixed(tokensFm.getUnitAmount(order.amountS).div(tokenbFm.getUnitAmount(order.amountB)), 8))} ${order.tokenS} ≈`}
              <Worth amount={tokensFm.getUnitAmount(order.amountS).div(tokenbFm.getUnitAmount(order.amountB))}
                     symbol={order.tokenS}/>
                </span>
          }/>

          <OrderMetaItem label={intl.get('common.sell') + ' ' + intl.get('order.price')} value={
            <span>
                  {`1 ${order.tokenS} = ${Number(toFixed(tokenbFm.getUnitAmount(order.amountB).div(tokensFm.getUnitAmount(order.amountS)), 8))} ${order.tokenB} ≈`}
              <Worth amount={tokenbFm.getUnitAmount(order.amountB).div(tokensFm.getUnitAmount(order.amountS))}
                     symbol={order.tokenB}/>
                </span>
          }/>

          <OrderMetaItem label={intl.get('common.ttl')}
                         value={`${validSince.format('MM-DD HH:mm')} ~ ${validUntil.format('MM-DD HH:mm')}`}/>
          <Button type="primary" className="mt15 ml15 mr15" onClick={submitRing}>{intl.get('common.exchange')}</Button>
        </div>
        <div className="bg-white mt10">
          <div className="pt15 pb15 fs14">{intl.get('user_center.my_assets')}</div>
          <HelperOfBalances />
        </div>
      </div>
    )
  }

}

function mapStatetoProps(state) {

  return {
    gas: state.gas,
    balance: state.sockets.balance.items,
    pendingTx: state.sockets.pendingTx,
    socket: state.sockets.socket
  }
}

export default connect(mapStatetoProps)(TakerConfirm)
