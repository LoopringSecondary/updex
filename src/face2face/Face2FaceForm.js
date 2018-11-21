import React from 'react'
import { Button, Toast,List,InputItem } from 'antd-mobile'
import { Icon as WebIcon, Input } from 'antd'
import { connect } from 'dva'
import { getBalanceBySymbol, isValidNumber } from 'modules/tokens/TokenFm'
import { getDisplaySymbol, toBig, toFixed, toHex ,toNumber} from 'LoopringJS/common/formatter'
import intl from 'react-intl-universal'
import Worth from 'modules/settings/Worth'
import {p2pVerification} from 'modules/orders/formatters'
import moment from 'moment'

class Face2FaceForm extends React.Component {
  state = {
    submitLoading:false
  }

  render() {
    const {balance, p2pOrder, pendingTx, gas, dispatch} = this.props
    const {amountB,amountS,tokenS,tokenB} = p2pOrder
    const gasPrice = toHex(toBig(gas.tabSelected === 'estimate' ? gas.gasPrice.estimate : gas.gasPrice.current))
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
    function validateAmountS(value) {
      if(p2pOrder.tokenS) {
        const tokenBalance = getBalanceBySymbol({balances:balance, symbol:p2pOrder.tokenS, toUnit:true})
        return tokenBalance.balance.gte(value)
      } else {
        return false
      }
    }
    function amountChange(side, value) {
      // const  value = Number(e.target.value).toString()
      if(side === 'buy') {
        if(value && !isValidNumber(value)) {
          Toast.info(intl.get('notifications.title.invalid_number'), 3, null, false);
          return;
        }
        dispatch({type:'p2pOrder/amountChange', payload:{'amountB':value}})
      } else {
        if(value && !isValidNumber(value)) {
          Toast.info(intl.get('notifications.title.invalid_number'), 3, null, false);
          return
        }
        if(value && !validateAmountS(value)){
          Toast.info(intl.get('todo_list.title_balance_not_enough',{symbol:p2pOrder.tokenS}), 3, null, false);
          return
        }
        dispatch({type:'p2pOrder/amountChange', payload:{'amountS':value}})
      }
    }
    const submitOrder = async ()=>{
      if(!amountB || !amountS || !isValidNumber(amountB)  || !isValidNumber(amountS) || !Number(amountB) || !Number(amountS)) {
        Toast.info(intl.get('notifications.title.invalid_number'), 3, null, false);
        return
      }
      if(!validateAmountS(amountS)){
        Toast.info(intl.get('todo_list.title_balance_not_enough',{symbol:p2pOrder.tokenS}), 3, null, false);
        return
      }
      this.setState({submitLoading:true})
      const tradeInfo = {}
      tradeInfo.amountB = toBig(amountB)
      tradeInfo.amountS = toBig(amountS)
      tradeInfo.tokenB = tokenB
      tradeInfo.tokenS = tokenS
      try {
        await p2pVerification(balance, tradeInfo, pendingTx ? pendingTx.items : [], gasPrice)
      } catch (e) {
        Toast.fail(e.message, 3, null, false);
        this.setState({submitLoading:false})
        return
      }
      let error = new Array()
      if(tradeInfo.error) error = error.concat(tradeInfo.error)
      if(tradeInfo.warn) error = error.concat(tradeInfo.warn)
      if (error && error.length > 0) {
        error.forEach(item => {
          switch(item.type) {
            case 'BalanceNotEnough':
              Toast.fail(intl.get('p2p_order.frozen_balance_not_enough',{frozen:item.value.frozen, require:item.value.required, token:item.value.symbol}), 5, null, false);
              break;
            case 'AllowanceNotEnough':
              Toast.fail(intl.get('p2p_order.p2p_allowance_not_enough',{token:item.value.symbol}), 5, null, false);
              break;
          }
        })
      } else {
        showLayer({id:'face2FaceConfirm'})
      }
      const validSince = moment().subtract(1, 'hours')
      const validUntil = moment().add(1, 'months')
      dispatch({type:'ttl/validTimeChange', payload:{validSince, validUntil}})
      this.setState({submitLoading:false})
    }
    const price = amountB && toBig(amountB).gt(0) && amountS && toBig(amountS).gt(0) ? toFixed(toBig(amountS).div(amountB), 8) : toFixed(toBig(0),8)
    return (
      <div className="">
        <div className="zb-b-b p15 ">
          <div className="row ml0 mr0 no-gutters align-items-center justify-content-center">
            <div onClick={showLayer.bind(this,{id:"helperOfTokens",side:'sell'})} className="col d-flex justify-content-center align-items-center">
              <span hidden className="mr10 text-primary fs14">{p2pOrder.tokenS}</span>
              <div className="bg-primary-light text-primary d-flex justify-content-center align-items-center" style={{width:"40px",height:'40px',borderRadius:'50em'}}>
                <i className={`icon-token-${p2pOrder.tokenS} fs24`}/>
              </div>
            </div>
            <div onClick={()=>dispatch({type:'p2pOrder/swap'})} className="col-auto text-center" style={{width:'30px'}}>
              <WebIcon type="swap" className={`text-primary fs18`} />
            </div>
            <div onClick={showLayer.bind(this,{id:"helperOfTokens",side:'buy'})} className="col d-flex justify-content-center align-items-center">
              <div className="bg-primary-light text-primary d-flex justify-content-center align-items-center" style={{width:"40px",height:'40px',borderRadius:'50em'}}>
                <i className={`icon-token-${p2pOrder.tokenB}  fs24`}/>
              </div>
              <span hidden className="ml10 text-primary fs14">{p2pOrder.tokenB}</span>
            </div>
          </div>
          <div className="row ml0 mr0 mt15 no-gutters align-items-stretch justify-content-center" style={{}}>
            <div className="col text-right no-border am-list-bg-none">
              <List  className="selectable">
                <InputItem
                  type="money"
                  onChange={amountChange.bind(this, 'sell')}
                  moneyKeyboardAlign="left"
                   value={amountS}
                  extra={
                    <div className="fs14 cursor-pointer zb-b-l color-black-1 d-flex align-items-center justify-content-center" style={{width:'7.5rem',textAlign:'justify',position:'absolute',right:0,top:'0',bottom:'0',margin:'auto'}} >
                      <div onClick={showLayer.bind(this,{id:"helperOfTokens",side:'sell'})} >
                        {p2pOrder.tokenS} <WebIcon className="fs12" type="caret-down" style={{marginLeft:'0.2rem'}}/>
                      </div>
                      <div onClick={showLayer.bind(this,{id:"helperOfAmount",symbol:p2pOrder.tokenS})}  className="fs16 text-primary" style={{position:'absolute',top:'1rem',width:'3.5rem',left:'-3.5rem'}}>
                        <WebIcon type="sliders" />
                      </div>
                    </div>
                  }
                  className="circle h-default fs18"
                  placeholder={intl.get('p2p_order.amount_to_sell')}
                >
                  <div className="fs14 color-black-1" style={{width:'4rem'}}>
                    {intl.get('common.sell')}
                  </div>
                </InputItem>
                <InputItem
                  type="money"
                  onChange={amountChange.bind(this, 'buy')}
                  moneyKeyboardAlign="left"
                  value={amountB}
                  extra={
                    <div onClick={showLayer.bind(this,{id:"helperOfTokens",side:'buy'})} className="fs14 cursor-pointer text-justify zb-b-l color-black-1 d-flex align-items-center justify-content-center" style={{width:'7.5rem',textAlign:'justify',position:'absolute',right:0,top:'0',bottom:'0',margin:'auto'}} >
                        {p2pOrder.tokenB}
                        <WebIcon className="fs12" type="caret-down" style={{marginLeft:'0.2rem'}}/>
                    </div>
                  }
                  className="circle h-default fs18 mt15"
                  placeholder={intl.get('p2p_order.amount_to_buy')}
                >
                  <div className="fs14 color-black-1" style={{width:'4rem'}}>
                    {intl.get('common.buy')}
                  </div>
                </InputItem>
                <List.Item
                  className="circle h-default mt15"
                  arrow={false}
                  onClick={()=>showLayer({id:'helperOfPrice'})}
                  extra={
                   <div className="fs14 color-black-1 cursor-pointer d-flex align-items-center justify-content-center">
                    { price >0 && <span>
                      1 {p2pOrder.tokenS} = {`${toNumber(toFixed(1/price,8))} ${p2pOrder.tokenB}`} ≈ <Worth amount={1/price} symbol={p2pOrder.tokenB}/>
                      </span>
                    }
                    { price == 0 && <span>
                      1 {p2pOrder.tokenS} = {`0.00 ${p2pOrder.tokenB}`} ≈ <Worth amount={0} symbol={p2pOrder.tokenB}/>
                      </span>
                    }
                    <WebIcon className="fs12" type="caret-down" style={{marginLeft:'0.2rem'}}/>
                    </div>
                  }
                >
                  <div className="fs14 color-black-1" style={{width:'4rem'}}>
                    {intl.get('common.price')}
                  </div>
                </List.Item>
              </List>
            </div>
          </div>
          <Button className="mt15" onClick={submitOrder} type="primary" disabled={this.state.submitLoading}>{intl.get('common.exchange')}</Button>
        </div>
      </div>
    );
  }
}
export default connect(({
  sockets,
  p2pOrder,
  pendingTx,
  gas
}) => ({
  p2pOrder:p2pOrder,
  balance:sockets.balance.items,
  pendingTx:pendingTx,
  gas:gas,
}))(Face2FaceForm)






