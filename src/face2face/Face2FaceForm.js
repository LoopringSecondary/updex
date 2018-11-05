import React from 'react'
import { Button, Toast,List,InputItem } from 'antd-mobile'
import { Icon as WebIcon, Input } from 'antd'
import { connect } from 'dva'
import { getBalanceBySymbol, isValidNumber } from 'modules/tokens/TokenFm'
import { getDisplaySymbol, toBig, toFixed, toHex ,toNumber} from 'LoopringJS/common/formatter'
import intl from 'react-intl-universal'
import Worth from 'modules/settings/Worth'

class Face2FaceForm extends React.Component {
  render() {
    const {balance, p2pOrder, dispatch} = this.props
    const {amountB,amountS} = p2pOrder
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
        return tokenBalance.balance.gt(value)
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
    const submitOrder = ()=>{
      if(!amountB || !amountS || !isValidNumber(amountB)  || !isValidNumber(amountS) || !Number(amountB) || !Number(amountS)) {
        Toast.info(intl.get('notifications.title.invalid_number'), 3, null, false);
        return
      }
      if(!validateAmountS(amountS)){
        Toast.info(intl.get('todo_list.title_balance_not_enough',{symbol:p2pOrder.tokenS}), 3, null, false);
        return
      }
      showLayer({id:'face2FaceConfirm'})
    }
    const price = amountB && toBig(amountB).gt(0) && amountS && toBig(amountS).gt(0) ? toFixed(toBig(amountS).div(amountB), 8) : toFixed(toBig(0),8)
    return (
      <div className="">
        <div className="zb-b-b p15 ">
          <div className="row ml0 mr0 no-gutters align-items-center justify-content-center">
            <div onClick={showLayer.bind(this,{id:"helperOfTokens",side:'sell'})} className="col center-center">
              <span hidden className="mr10 text-primary fs14">{p2pOrder.tokenS}</span>
              <div className="bg-primary-light text-primary circle-40 center-center">
                <i className={`icon-token-${p2pOrder.tokenS} fs24`}/>
              </div>
            </div>
            <div onClick={()=>dispatch({type:'p2pOrder/swap'})} className="col-auto text-center" style={{width:'30px'}}>
              <WebIcon type="swap" className={`text-primary fs18`} />
            </div>
            <div onClick={showLayer.bind(this,{id:"helperOfTokens",side:'buy'})} className="col center-center">
              <div className="bg-primary-light text-primary circle-40 center-center">
                <i className={`icon-token-${p2pOrder.tokenB}  fs24`}/>
              </div>
              <span hidden className="ml10 text-primary fs14">{p2pOrder.tokenB}</span>
            </div>
          </div>
          <div className="row ml0 mr0 mt15 no-gutters center-center" style={{}}>
            <div className="col no-border am-list-bg-none">
              <List  className="selectable text-left">
                <InputItem
                  type="text"
                  onChange={amountChange.bind(this, 'sell')}
                  value={amountS}
                  extra={
                    <div className="fs14 cursor-pointer zb-b-l color-black-1 center-center w-75" style={{textAlign:'justify',position:'absolute',right:0,top:'0',bottom:'0',margin:'auto'}} >
                      <div onClick={showLayer.bind(this,{id:"helperOfTokens",side:'sell'})} >
                        {p2pOrder.tokenS} <WebIcon className="fs12" type="caret-down" style={{marginLeft:'0.2rem'}}/>
                      </div>
                      <div onClick={showLayer.bind(this,{id:"helperOfAmountOfP2P",symbol:p2pOrder.tokenS})}  className="fs16 text-primary w-35" style={{position:'absolute',marginLeft:'-100%'}}>
                        <WebIcon type="sliders" />
                      </div>
                    </div>
                  }
                  className="circle h-default fs18"
                  placeholder={intl.get('p2p_order.amount_to_sell')}
                >
                  <div className="fs14 color-black-1 w-40">
                    {intl.get('common.sell')}
                  </div>
                </InputItem>
                <InputItem
                  type="text"
                  onChange={amountChange.bind(this, 'buy')}
                  value={amountB}
                  extra={
                    <div onClick={showLayer.bind(this,{id:"helperOfTokens",side:'buy'})} className="fs14 cursor-pointer text-justify zb-b-l color-black-1 center-center w-75" style={{textAlign:'justify',position:'absolute',right:0,top:'0',bottom:'0',margin:'auto'}} >
                        {p2pOrder.tokenB}
                        <WebIcon className="fs12" type="caret-down" style={{marginLeft:'0.2rem'}}/>
                    </div>
                  }
                  className="circle h-default fs18 mt15"
                  placeholder={intl.get('p2p_order.amount_to_buy')}
                >
                  <div className="fs14 color-black-1 w-40">
                    {intl.get('common.buy')}
                  </div>
                </InputItem>
                <List.Item
                  className="circle h-default mt15"
                  arrow={false}
                  onClick={()=>showLayer({id:'helperOfPrice'})}
                  extra={
                   <div className="fs14 color-black-4 cursor-pointer center-center">
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
                  <div className="fs14 color-black-1 w-40">
                    {intl.get('common.price')}
                  </div>
                </List.Item>
              </List>
            </div>
          </div>
          <Button className="mt15" onClick={submitOrder} type="primary">{intl.get('common.exchange')}</Button>
        </div>
      </div>
    );
  }
}
export default connect(({
  sockets,
  p2pOrder
}) => ({
  p2pOrder:p2pOrder,
  balance:sockets.balance.items,
}))(Face2FaceForm)






