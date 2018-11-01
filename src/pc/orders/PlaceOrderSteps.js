import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Settings from 'mobile/settings/Settings'
import { Icon } from 'antd'
import { Button,Modal,Toast,NavBar} from 'antd-mobile'
import { toBig, toHex, clearHexPrefix } from 'LoopringJS/common/formatter'
import intl from 'react-intl-universal'
import { createWallet } from 'LoopringJS/ethereum/account'
import * as orderFormatter from 'modules/orders/formatters'
import { getTokensByMarket } from 'modules/formatter/common'
import { Page, Pages } from 'LoopringUI/components/Pages'
import { connect } from 'dva'
import config from 'common/config'
import storage from 'modules/storage'
import HelperOfTTL from './HelperOfTTL'
import {HelperOfSignStepsModal} from '../sign/Modals'

const OrderMetaItem = (props) => {
  const {label, value, showArrow = false, onClick = () => {}} = props
  return (
    <div onClick={onClick} className="row ml0 mr0 zb-b-t no-gutters" style={{padding: '10px 15px'}}>
      <div className="col">
        <div className="fs14 color-black-2 lh30 text-left">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs14 color-black-1 text-wrap lh30 text-left">{value}</div>
      </div>
      {
        !!showArrow &&
        <div className="col-auto text-right">
          <div className="fs14 text-primary text-wrap lh30 text-left ml5">
            <Icon type="right"/>
          </div>
        </div>
      }

    </div>
  )
}
const WalletItem = (props) => {
  const {title, description, icon, layout, showArrow} = props
  if (layout === 'vertical') {
    return (
      <div className="pl10 pr10 pt15 pb15">
        <div className="text-center color-black-1">
          <i className={`fs28 icon-${icon}`}></i>
        </div>
        <div className="fs18">{title}</div>
      </div>
    )
  } else {
    return (
      <div className="row pt15 pb15 ml0 mr0 align-items-center zb-b-b no-gutters">
        <div className="col-auto pr5 text-center color-black-1 fs24 pl15" style={{minWidth: '40px'}}>
          {typeof icon === 'string' &&
          <i className={`icon-${icon}`}></i>
          }
          {typeof icon !== 'string' && icon}
        </div>
        <div className="col pl15">
          <div className="fs16 color-black-1 text-wrap text-left">{title}</div>
          {description && <div className="fs14 color-black-3 text-left">{description}</div>}
        </div>
        {showArrow &&
        <div className="col-auto text-right color-black-3 pr15">
          <Icon type="right"/>
        </div>
        }
      </div>
    )
  }
}

class PlaceOrderSteps extends React.Component {

  state={

  }

  componentWillReceiveProps (newProps) {
    const {auth} = newProps
    const {hash} = this.state
    if (hash === auth.hash && auth.status && auth.status.toLowerCase() === 'accept') {
      Modal.alert(intl.get('notifications.title.place_order_success'))
      this.setState({hash: ''})
    }
  }

  render () {
    const {placeOrder, settings, marketcap, dispatch,placeOrderSteps} = this.props
    const {pair, priceInput, amountInput, validSince, validUntil} = placeOrder
    let side = placeOrderSteps.side ? placeOrderSteps.side : placeOrder.side
    
    const total = toBig(amountInput).times(toBig(priceInput)).toString(10)
    const tokens = getTokensByMarket(pair)
    const lrcFeeValue = orderFormatter.calculateLrcFee(marketcap, total, 2, tokens.right)
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
    const showTTL = () => {
      // hideLayer({id:'placeOrderSteps'})
      showLayer({id: 'helperOfTTL'})
    }
    const showLRCFee = () => {
      // hideLayer({id:'placeOrderSteps'})
      showLayer({id:'settings'})
    }
    const next = async (page) => {
      let order = {}
      const owner = storage.wallet.getUnlockedAddress()
      if (owner) {
        order.owner = storage.wallet.getUnlockedAddress()
      }
      order.delegateAddress = config.getDelegateAddress()
      order.protocol = settings.trading.contract.address
      const tokenB = side.toLowerCase() === 'buy' ? config.getTokenBySymbol(tokens.left) : config.getTokenBySymbol(tokens.right)
      const tokenS = side.toLowerCase() === 'sell' ? config.getTokenBySymbol(tokens.left) : config.getTokenBySymbol(tokens.right)
      order.tokenB = tokenB.address
      order.tokenS = tokenS.address
      order.amountB = toHex(toBig(side.toLowerCase() === 'buy' ? amountInput : total).times('1e' + tokenB.digits))
      order.amountS = toHex(toBig(side.toLowerCase() === 'sell' ? amountInput : total).times('1e' + tokenS.digits))
      order.lrcFee = toHex(toBig(lrcFeeValue).times(1e18))
      order.validSince = toHex(validSince.unix())
      order.validUntil = toHex(validUntil.unix())
      order.marginSplitPercentage = 50
      order.buyNoMoreThanAmountB = side.toLowerCase() === 'buy'
      order.walletAddress = config.getWalletAddress()
      order.orderType = 'market_order'
      const authAccount = createWallet()
      order.authAddr = authAccount.getAddressString()
      order.authPrivateKey = clearHexPrefix(authAccount.getPrivateKeyString())
      const unsign = [{type:'order', data:order}] //[{type:'approveZero', data:tx}, {type:'approve', data:tx}]
      dispatch({type: 'task/setTask', payload: {task:'sign', unsign}})
      // dispatch({type: 'layers/hideLayer', payload: {id: 'placeOrderSteps'}})
    }
  return (
    <div className="bg-white" style={{height:'100%'}}>
        <NavBar
          className="bg-white"
          mode="light"
          leftContent={[
            <span onClick={()=>hideLayer({id:'placeOrderSteps'})} className="text-primary cursor-pointer" key="1"><Icon type="close" /></span>,
          ]}
          rightContent={null && [
            <span className="color-black-1" key="1"  onClick={()=>{}}><Icon type="question-circle-o" /></span>
          ]}
        >
          <div className="color-black-1 fs16">
            Order Confirm
          </div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
        <Pages active="order">
          <Page id="order" render={({page}) =>
            <div className="">
              <div className="bg-white">
                <div className="pt40 pb40 row ml0 mr0 no-gutters align-items-center justify-content-center">
                  <div className="col-auto">
                    <div
                      className="radius-circle bg-primary color-white d-inline-flex justify-content-center align-items-center"
                      style={{width: '40px', height: '40px'}}>
                      <i className={`icon-token-${side === 'buy' ? tokens.right : tokens.left} fs24`}/>
                    </div>
                  </div>
                  <div className="col-auto pl25 pr25 text-center">
                    <Icon type="swap" className={`color-black-1 fs20`}/>
                  </div>
                  <div className="col-auto">
                    <div
                      className="radius-circle bg-primary color-white d-inline-flex justify-content-center align-items-center"
                      style={{width: '40px', height: '40px'}}>
                      <i className={`icon-token-${side === 'buy' ? tokens.left : tokens.right} fs24`}/>
                    </div>
                  </div>
                </div>
                {
                  side === 'buy' &&
                  <div>
                    <OrderMetaItem label={intl.get(`common.buy`)} value={`${amountInput} ${pair.split('-')[0]}`}/>
                    <OrderMetaItem label={intl.get(`common.sell`)} value={`${total} ${pair.split('-')[1]}`}/>
                  </div>
                }
                {
                  side === 'sell' &&
                  <div>
                    <OrderMetaItem label={intl.get(`common.sell`)} value={`${amountInput} ${pair.split('-')[0]}`}/>
                    <OrderMetaItem label={intl.get(`common.buy`)} value={`${total} ${pair.split('-')[1]}`}/>
                  </div>
                }
                <OrderMetaItem label={intl.get("common.price")} value={`${priceInput} ${pair}`} />
                <OrderMetaItem showArrow={true} onClick={()=>showLRCFee()} label={intl.get('common.lrc_fee')} value={<div className="text-primary cursor-pointer">{lrcFeeValue} LRC({settings.trading.lrcFee/10}%)</div>} />
                <OrderMetaItem showArrow={true} onClick={()=>showTTL()} label={intl.get('common.ttl')} value={<div className="text-primary cursor-pointer">{validSince.format('MM-DD HH:mm')} ~ {validUntil.format('MM-DD HH:mm')}</div>}  />
                <div className="divider 1px zb-b-t"></div>
                <div className="pt15 pb15 color-black-3 fs12 text-center">
                  <Icon className="mr5" type="exclamation-circle-o" />{intl.get('place_order_confirm.no_cost_gas')}
                </div>
                <Button type="primary" className="fs18 ml15 mr15" onClick={next.bind(this, page)}>{intl.get('place_order_confirm.sign_and_submit')}</Button>
              </div>
            </div>
          }/>
        </Pages>
        <Containers.Layers id="settings">
          <UiContainers.Drawer position="right" id="settings" width="480px"  style={{margin:'0 auto',height:'100%'}}>
            <Settings />
          </UiContainers.Drawer>
        </Containers.Layers>
        <Containers.Layers id="helperOfTTL">
          <UiContainers.Drawer position="right" id="helperOfTTL" width="480px"  style={{margin:'0 auto',height:'100%'}}>
            <HelperOfTTL />
          </UiContainers.Drawer>
        </Containers.Layers>
        <HelperOfSignStepsModal />
    </div>
    )
  }
}

function mapToProps (state) {
  return {
    placeOrder: state.placeOrder,
    settings: state.settings,
    marketcap: state.sockets.marketcap.items,
    auth: state.sockets.circulrNotify.item
  }
}

export default connect(mapToProps)(PlaceOrderSteps)
