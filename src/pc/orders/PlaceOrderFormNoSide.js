import React from 'react'
import { Button, InputItem, List, SegmentedControl, Toast ,Modal,Slider} from 'antd-mobile'
import { Icon as WebIcon,Affix } from 'antd'
import { connect } from 'dva'
import { getTokensByMarket } from 'modules/formatter/common'
import { getDisplaySymbol, toBig,toNumber} from 'LoopringJS/common/formatter'
import intl from 'react-intl-universal'
import * as orderFormatter from 'modules/orders/formatters'
import * as tokenFormatter from 'modules/tokens/TokenFm'
import moment from 'moment'
import config from 'common/config'
import Notification from 'LoopringUI/components/Notification'
import storage from 'modules/storage'
import Worth from 'modules/settings/Worth'

const Item = List.Item;

// 通过自定义 moneyKeyboardWrapProps 修复虚拟键盘滚动穿透问题
// https://github.com/ant-design/ant-design-mobile/issues/307
// https://github.com/ant-design/ant-design-mobile/issues/163
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  }
}
class PlaceOrderForm extends React.Component {

  componentWillReceiveProps(newProps) {
    const {marketcap,dispatch, placeOrder,lastPrice} = newProps;
    const {pair,priceChanged} = placeOrder;
    if (this.props.marketcap !== newProps.marketcap && newProps.marketcap.length > 0 && !priceChanged) {
      const tokens = getTokensByMarket(pair)
      const currentPrice = orderFormatter.getMarketPrice(marketcap,tokens.left, tokens.right);
      let mPrice = currentPrice || lastPrice || 0
      if(pair) {
        const marketConfig = config.getMarketBySymbol(tokens.left, tokens.right)
        if(marketConfig) {
          mPrice = orderFormatter.formatPriceByMarket(mPrice, marketConfig)
        }
      }
      if (!priceChanged) {
        dispatch({type: 'placeOrder/priceChange', payload: {priceInput: mPrice}})
      }
    }
  }

  render(){
    const {dispatch,placeOrder,marketcap,balance,preference,trading,lastPrice} = this.props
    const {pair,buySliderValue, sellSliderValue} = placeOrder
    const {side} = this.props
    const tokens = getTokensByMarket(pair)
    const marketConfig = config.getMarketBySymbol(tokens.left, tokens.right)
    const right = config.getTokenBySymbol(tokens.right)
    const amountPrecision = Math.max(0, right.precision - marketConfig.pricePrecision)
    let amount = placeOrder.amountInput
    let price = placeOrder.priceInput

    const submitEnable = orderFormatter.isValidAmount(price) && orderFormatter.isValidAmount(amount)
    const total = (Number(amount) > 0) && (Number(price) > 0) ? toBig(amount).times(toBig(price)).toString(10) : 0
    let sell = {}, buy = {}
    if(side === 'buy') {
      sell = {token : tokens.right}
      buy = {token : tokens.left}
    } else {
      sell = {token : tokens.left}
      buy = {token : tokens.right}
    }
    const showLayer = (payload={})=>{
      dispatch({
        type:'layers/showLayer',
        payload:{
          ...payload
        }
      })
    }
    const hideLayer = (payload={})=>{
      dispatch({
        type:'layers/hideLayer',
        payload:{
          ...payload
        }
      })
    }
    const sideChange = (e)=>{
      const side = e.nativeEvent.selectedSegmentIndex === 0 ? 'buy' : 'sell'
      dispatch({
        type:'placeOrder/sideChangeEffects',
        payload:{
          side
        }
      })
    }
    const amountChange = (value)=>{
      dispatch({
        type:'placeOrder/amountChange',
        payload:{
          amountInput:value
        }
      })
    }
    const priceChange = (value)=>{
      dispatch({
        type:'placeOrder/priceChangeEffects',
        payload:{
          price:value
        }
      })
    }
    const showAdvanceChange = (value)=>{
      dispatch({
        type:'placeOrder/showAdvanceChange',
        payload:{
          showAdvance:true
        }
      })
      showLayer({id:'helperOfAdvance'})
    }
    const toConfirm = async () => {
      if (!orderFormatter.isValidAmount(price)) {
        Toast.info(intl.get('common.invalid_item', {item: intl.get('common.price')}), 1, null, false);
        return
      }
      if (!orderFormatter.isValidAmount(amount)) {
        Toast.info(intl.get('common.invalid_item', {item: intl.get('common.amount')}), 1, null, false);
        return
      }
      if(price !== placeOrder.priceInput) {
        priceChange(price)
      }

      if(!balance || !marketcap) {
        Notification.open({
          message:intl.get('notifications.title.place_order_failed'),
          description:intl.get('notifications.message.failed_fetch_data_from_server'),
          type:'error'
        })
        return
      }
      const {pair} = placeOrder;
      const tokens = getTokensByMarket(pair)
      const currentPrice = orderFormatter.getMarketPrice(marketcap,tokens.left, tokens.right);
      let mPrice = currentPrice || lastPrice || 0
      if(pair) {
        const marketConfig = config.getMarketBySymbol(tokens.left, tokens.right)
        if(marketConfig) {
          mPrice = orderFormatter.formatPriceByMarket(mPrice, marketConfig)
        }
      }

      if(side === 'buy' && toNumber(price) > 1.05 * toNumber(mPrice)){
        Modal.alert(intl.get('notifications.title.place_order_price_confirm'),
          intl.get('notifications.message.place_order_price_high'),[
          { text: intl.get('common.cancel'), onPress: () => {} },
          { text: intl.get('common.ok'), onPress: () => submitOrder() },
        ])
      }else if(side === 'sell' && toNumber(price) < 0.95 * toNumber(mPrice)){
        Modal.alert(intl.get('notifications.title.place_order_price_confirm'),
          intl.get('notifications.message.place_order_price_low'),[
            { text: intl.get('common.cancel'), onPress: () => {} },
            { text: intl.get('common.ok'), onPress: () => submitOrder() },
          ])
      }else{
        submitOrder()
      }
    }

    const submitOrder = () => {
      const total = toBig(price).times(amount)
      const totalWorth = orderFormatter.calculateWorthInLegalCurrency(marketcap, tokens.right, total)
      if(!totalWorth.gt(0)) {
        Notification.open({
          message:intl.get('notifications.title.place_order_failed'),
          description:intl.get('notifications.message.failed_fetch_data_from_server'),
          type:'error'
        })
        return
      }
      let allowed = false
      let currency = preference.currency;
      let priceSymbol = getDisplaySymbol(currency)
      if(currency === 'USD') {
        priceSymbol = '10' + priceSymbol
        if(totalWorth.gt(10)) {
          allowed = true
        }
      } else {
        priceSymbol = '50' + priceSymbol
        if(totalWorth.gt(50)) {
          allowed = true
        }
      }
      if(!allowed) {
        Notification.open({
          message:intl.get('notifications.title.not_allowed_place_order_worth'),
          description:intl.get('notifications.message.not_allowed_place_order_worth', {worth: priceSymbol}),
          type:'error'
        })
        return
      }
      const validSince = moment()
      let validUntil = null
      switch(trading.timeToLiveUnit) {
        case 'hour': validUntil = moment().add(trading.timeToLive, 'hours'); break;
        case 'day': validUntil = moment().add(trading.timeToLive, 'days'); break;
        case 'week': validUntil = moment().add(trading.timeToLive, 'weeks'); break;
        case 'month': validUntil = moment().add(trading.timeToLive, 'months'); break;
      }
      dispatch({type:'placeOrder/validTimeChange', payload:{validSince, validUntil}})
      showLayer({id:'placeOrderSteps',side:side})
    }

    const showAmountHelper = () => {
      if(side === 'buy') {
        if(Number(price) > 0) {
          showLayer({id:'helperOfAmount',side:'sell'})
        } else {
          Toast.info(intl.get('common.invalid_item', {item: intl.get('common.price')}), 1, null, false);
        }
      } else {
        showLayer({id:'helperOfAmount',side:'sell'})
      }
    }
    const menu1 = `${intl.get("common.buy")} ${tokens.left}`
    const menu2 = `${intl.get("common.sell")} ${tokens.left}`

    const amountSliderDisable = (pair, side, price, balance) => {
      if(!pair || !side || !balance  || !price || toNumber(price) <= 0 || balance.length === 0) return true
      const tokens = getTokensByMarket(pair)
      const balanceL = tokenFormatter.getBalanceBySymbol({balances: balance, symbol: tokens.left, toUnit: true})
      const balanceR = tokenFormatter.getBalanceBySymbol({balances: balance, symbol: tokens.right, toUnit: true})
      if(side === 'buy') {
        if(toNumber(price) === 0) return true
        return balanceR.balance.div(price).lte(0)
      } else {
        return balanceL.balance.lte(0)
      }
    }

    function amountSliderChange(e) {
      let availableAmount = 0
      const balanceL = tokenFormatter.getBalanceBySymbol({balances: balance, symbol: tokens.left, toUnit: true})
      const balanceR = tokenFormatter.getBalanceBySymbol({balances: balance, symbol: tokens.right, toUnit: true})
      if (side === 'buy') {
        availableAmount = balanceR.balance.div(price)
      } else {
        availableAmount = balanceL.balance
      }
      const amount = orderFormatter.sliderEffectAmount(availableAmount, e, {symbol:tokens.left}, {symbol:tokens.right})
      dispatch({type: 'placeOrder/amountChange', payload: {amountInput: amount}})
      if(side === 'buy') {
        dispatch({type: 'placeOrder/buySliderValueChange', payload: {value: e}})
      } else {
        dispatch({type: 'placeOrder/sellSliderValueChange', payload: {value: e}})
      }
    }

    const sliderValue = (side, buySliderValue, sellSliderValue) => {
      if(side === 'buy') {
        return buySliderValue
      } else {
        return sellSliderValue
      }
    }

    return (
      <div>
        <div className="p15 pt10">
          <List className="no-border am-list-bg-none selectable">
            <InputItem
              type="text"
              placeholder={`0.${'0'.repeat(marketConfig.pricePrecision)}`}
              value={price ? price : null}
              clear={false}
              className="circle h-default text-number"
              extra={
                <div style={{width:'auto',textAlign:'right'}} className="fs13 lh20">
                  {
                    price>0 && <span className="color-black-4 fs12">≈<Worth amount={price} symbol={tokens.right}/></span>
                  }
                  <span className="color-black-3 d-inline-block" style={{width:'35px'}}>{tokens.right}</span>
                </div>
              }
              onChange={priceChange}
            ><div className="fs13 color-black-1 pr5 text-default" style={{width:'50px'}}>{intl.get("common.price")}</div></InputItem>
            <InputItem
              type="text"
              placeholder={amountPrecision > 0 ? `0.${'0'.repeat(amountPrecision)}` : '0'}
              value={amount ? amount : null}
              clear={false}
              onChange={amountChange}
              className="circle h-default mt15 text-number"
              extra={
                <div style={{width:'auto',textAlign:'right'}} className="fs13 lh20">
                  <span className="color-black-3 d-inline-block" style={{width:'35px'}}>{tokens.left}</span>
                </div>
              }
            ><div className="fs13 color-black-1 pr5 text-default" style={{width:'50px'}}>{intl.get("common.amount")}</div></InputItem>
            <Item
              className="overflow-visible"
              style={{marginTop:'-0.5rem',marginBottom:'-1.3rem'}}
            >
              <div className="pl0 pr0 placeOrder">
                <Slider
                  marks={{0:'0%',25:'25%',50:'50%',75:'75%',100:'100%'}}
                  step={10}
                  disabled={amountSliderDisable(pair, side, price, balance)}
                  onChange={amountSliderChange.bind(this)}
                  value={sliderValue(side, buySliderValue, sellSliderValue)}
                />
              </div>
            </Item>
            <InputItem
              type="text"
              disabled={true}
              placeholder={amountPrecision > 0 ? `0.${'0'.repeat(amountPrecision)}` : '0'}
              value={total ? total : null}
              clear={false}
              className="circle h-default mt15 text-number"
              extra={
                <div style={{width:'auto',textAlign:'right'}} className="fs13 lh20">
                  <span className="color-black-3 d-inline-block" style={{width:'35px'}}>{tokens.right}</span>
                </div>
              }
            ><div className="fs13 color-black-1 pr5 text-default" style={{width:'50px'}}>{intl.get("common.total")}</div></InputItem>

            <Button onClick={toConfirm} className={`fs16 p10 border-none d-flex align-items-center justify-content-center w-100 d-block mt15 ${submitEnable ? " " : "t-light-bak"} ${side==='buy' ? 'bg-success' : 'bg-error'}`} type={"primary"} disabled={false && !submitEnable}>
                <div className="lh20">
                  {intl.get(`common.${side}`)}
                  &nbsp;
                  {amount>0 ?  <span className="text-number">{amount}</span> : null}
                  &nbsp;
                  {tokens.left} 
                </div>
            </Button>
          </List>
        </div>
      </div>
    )
  }


}
export default connect(({
  placeOrder,
  sockets:{tickers, balance, marketcap},
  settings:{preference,trading}
})=>({
  placeOrder,
  lastPrice:tickers.item.loopr ? tickers.item.loopr.last : null,
  balance:balance.items ? balance.items : null,
  marketcap:marketcap.items ? marketcap.items : null,
  preference,trading
}))(PlaceOrderForm)







