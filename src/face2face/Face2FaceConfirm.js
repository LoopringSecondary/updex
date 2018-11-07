import React from 'react'
import { Icon } from 'antd'
import { Button,NavBar } from 'antd-mobile'
import config from 'common/config'
import intl from 'react-intl-universal'
import * as orderFormatter from 'modules/orders/formatters'
import Notification from 'LoopringUI/components/Notification'
import QRCode from 'qrcode.react'
import { Page, Pages } from 'LoopringUI/components/Pages'
import { connect } from 'dva'
import moment from 'moment'
import { toHex, toFixed,toBig } from 'LoopringJS/common/formatter'
import storage from 'modules/storage'
import Worth from 'modules/settings/Worth'

const OrderMetaItem = (props) => {
  const {label, value,showArrow=false,onClick=()=>{},className=""} = props
  return (
    <div onClick={onClick} className={`row ml0 mr0 pl15 pr15 pt10 pb10 zb-b-b no-gutters ${className}`}>
      <div className="col-auto">
        <div className="fs13 color-black-2 text-left">{label}</div>
      </div>
      <div className="col text-right">
        <div className="fs13 color-black-1 text-wrap text-right">{value}</div>
      </div>
      {
        !!showArrow &&
        <div className="col-auto text-right">
          <div className="fs13 text-primary text-wrap text-left ml5">
            <Icon type="right" />
          </div>
        </div>
      }

    </div>
  )
}

function PlaceOrderSteps (props) {
  const {p2pOrder, balance, settings, marketcap, gas,pendingTx, dispatch} = props
  const gasPrice = toHex(toBig(gas.tabSelected === 'estimate' ? gas.gasPrice.estimate : gas.gasPrice.current))
  let {tokenS, tokenB, amountS, amountB, count = 1} = p2pOrder
  amountS =  toBig(amountS)
  amountB = toBig(amountB)
  const validSince = p2pOrder.validSince || moment()
  const validUntil = p2pOrder.validUntil || moment().add(1, 'months')
  const price = toFixed(amountS.div(amountB), 4)

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
  const next = async (page) => {
    const tradeInfo = {}
    tradeInfo.amountB = amountB
    tradeInfo.amountS = amountS
    tradeInfo.tokenB = tokenB
    tradeInfo.tokenS = tokenS
    tradeInfo.validSince = validSince.unix()
    tradeInfo.validUntil = validUntil.unix()
    tradeInfo.marginSplit = 0
    tradeInfo.milliLrcFee = 0
    tradeInfo.lrcFee = 0
    tradeInfo.delegateAddress = config.getDelegateAddress()
    tradeInfo.protocol = settings.trading.contract.address
    tradeInfo.gasLimit = config.getGasLimitByType('approve').gasLimit
    tradeInfo.gasPrice = toHex(Number(gasPrice) * 1e9)
    tradeInfo.orderType = 'p2p_order'
    tradeInfo.roleType = 'maker'
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
    if (tradeInfo.error) {
      tradeInfo.error.map(item => {
        if (item.value.symbol === 'ETH') {
          Notification.open({
            message: intl.get('notifications.title.place_order_failed'),
            description: intl.get('notifications.message.eth_is_required_when_place_order', {required: item.value.required}),
            type: 'error',
            actions: (
              <div>
                <Button className="alert-btn mr5" onClick={() => dispatch({
                  type: 'layers/showLayer',
                  payload: {id: 'receiveToken', symbol: 'ETH'}
                })}>
                  {`${intl.get('actions.receive')} ETH`}
                </Button>
              </div>
            )
          })
        } else if (item.value.symbol === 'LRC') {
          Notification.open({
            message: intl.get('notifications.title.place_order_failed'),
            description: intl.get('notifications.message.lrcfee_is_required_when_place_order', {required: item.value.required}),
            type: 'error',
            actions: (
              <div>
                <Button className="alert-btn mr5" onClick={() => dispatch({
                  type: 'layers/showLayer',
                  payload: {id: 'receiveToken', symbol: 'LRC'}
                })}>
                  {`${intl.get('actions.receive')} LRC`}
                </Button>
              </div>
            )
          })
        }
      })
      dispatch({type: 'p2pOrder/loadingChange', payload: {loading: false}})
      return
    }
    try {
      const {order, unsigned} = await orderFormatter.signP2POrder(tradeInfo, (window.Wallet && window.Wallet.address) || storage.wallet.getUnlockedAddress())
      dispatch({type: 'task/setTask', payload: {task:'signP2P', unsign:unsigned}})
    } catch (e) {
      Notification.open({
        message: intl.get('notifications.title.place_order_failed'),
        description: e.message,
        type: 'error'
      })
    }
  }

  return (
    <div className="bg-white" style={{height:'100%'}}>
      <Pages active="order">
        <Page id="order" render={({page}) =>
          <div>
            <NavBar
              className="zb-b-b"
              mode="light"
              onLeftClick={hideLayer.bind(this, {id: 'face2FaceConfirm'})}
              leftContent={[
                <span className="text-primary cursor-pointer" key="1"><Icon type="close" /></span>,
              ]}
              rightContent={null && [
                <span className="text-primary" key="1"  onClick={()=>{}}><Icon type="swap" /></span>
              ]}
            >
              <div className="color-black fs16">
                {intl.get('p2p_order.order_title')}
              </div>
            </NavBar>
            <div className="pt15 pb15 bg-white">
              <div className="pt15 pb30 row ml0 mr0 no-gutters align-items-center justify-content-center zb-b-b">
                <div className="col-auto">
                  <div className="bg-primary-light text-primary d-flex align-items-center justify-content-center circle-40" style={{}}>
                    <i className={`icon-token-${tokenS} fs24`}/>
                  </div>
                </div>
                <div className="col-auto pl25 pr25 text-center">
                  <Icon type="swap" className={`text-primary fs20`}/>
                </div>
                <div className="col-auto">
                  <div className="bg-primary-light text-primary d-flex align-items-center justify-content-center  circle-40" style={{}}>
                    <i className={`icon-token-${tokenB} fs24`}/>
                  </div>
                </div>
              </div>
              <OrderMetaItem label={intl.get('common.buy')} value={`${amountB} ${tokenB}`}/>
              <OrderMetaItem label={intl.get('common.sell')} value={`${amountS} ${tokenS}`}/>
              {false &&  <OrderMetaItem label={intl.get('order.price')} value={`${price} ${tokenS}/${tokenB}`}/>}
              <OrderMetaItem label={intl.get('common.buy')+' '+intl.get('order.price')} value={
                <span>
                  {`1 ${tokenB} = ${Number(price)} ${tokenS} ≈`} <Worth amount={price} symbol={tokenS}/>
                </span>
              }/>
              <OrderMetaItem label={intl.get('common.sell')+' '+intl.get('order.price')} value={
                <span>
                  {`1 ${tokenS} = ${Number(toFixed(1/price,8))} ${tokenB} ≈`} <Worth amount={1/price} symbol={tokenB}/>
                </span>
              }/>
              <OrderMetaItem label={intl.get('common.type')} value={intl.get('p2p_order.user_center_p2p')}/>
              <OrderMetaItem label={intl.get('common.ttl')} showArrow={true}
                              className="hover-default" onClick={showLayer.bind(this,{id:'helperOfTTL'})} 
                             value={<div className="text-primary">{`${validSince.format('MM-DD HH:mm')} ~ ${validUntil.format('MM-DD HH:mm')}`}</div>}/>
              <OrderMetaItem label={intl.get('p2p_order.count')} showArrow={true}
                            className="hover-default" onClick={showLayer.bind(this,{id:'helperOfMiniFill'})}
                             value={<div  className="text-primary cursor-pointer pl40"><span className="mr5">{count}</span></div>}/>
              <Button type="primary" className="m15" onClick={next.bind(this, page)}>{intl.get('place_order_confirm.sign_and_submit')}</Button>
            </div>
          </div>
        }/>
        <Page id="qrcode" render={({page}) =>
          <div className="bg-white">
            <div className="p15 color-black-1 fs18 zb-b-b text-center no-gutters">
              <div className="row">
                <div className="col-auto text-left pl20 pr20" onClick={page.gotoPage.bind(this, {id: 'order'})}>
                  <Icon type="left"/>
                </div>
                <div className="col">{intl.get('p2p_order.user_center_p2p')}</div>
                <div className="col-auto color-white pl20 pr20">
                  <Icon  type="left" style={{opacity:0}}/>
                </div>
              </div>
            </div>
            <div className="text-center mt15">
              <div className="p15 d-inline-block" style={{background:'#fff'}}>
                <QRCode value={p2pOrder.qrcode} size={240} level='H'/>
              </div>
            </div>
            <div className="zb-b-t p15 mt15">
              <OrderMetaItem label={intl.get('common.buy')} value={`${amountB} ${tokenB}`}/>
              <OrderMetaItem label={intl.get('common.sell')} value={`${amountS} ${tokenS}`}/>
              {false && <OrderMetaItem label={intl.get('order.price')} value={`${price} ${tokenS}/${tokenB}`}/>}
              <OrderMetaItem label={intl.get('common.buy')+' '+intl.get('order.price')} value={
                <span>
                  {`1 ${tokenB} = ${Number(price)} ${tokenS} ≈`} <Worth amount={price} symbol={tokenS}/>
                </span>
              }/>
              <OrderMetaItem label={intl.get('common.sell')+' '+intl.get('order.price')} value={
                <span>
                  {`1 ${tokenS} = ${Number(toFixed(1/price,8))} ${tokenB} ≈`} <Worth amount={1/price} symbol={tokenB}/>
                </span>
              }/>
            </div>
          </div>
        }/>
      </Pages>
    </div>
  )
}

function mapToProps (state) {
  return {
    p2pOrder: state.p2pOrder,
    balance: state.sockets.balance.items,
    marketcap: state.sockets.marketcap.items,
    tokens: state.tokens.items,
    settings: state.settings,
    pendingTx: state.pendingTx,
    gas: state.gas,
  }
}

export default connect(mapToProps)(PlaceOrderSteps)
