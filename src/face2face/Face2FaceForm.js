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
        if(!isValidNumber(value)) {
          Toast.info(intl.get('notifications.title.invalid_number'), 3, null, false);
          return;
        }
        dispatch({type:'p2pOrder/amountChange', payload:{'amountB':toBig(value)}})
      } else {
        if(!isValidNumber(value)) {
          Toast.info(intl.get('notifications.title.invalid_number'), 3, null, false);
          return
        }
        if(!validateAmountS(value)){
          Toast.info(intl.get('todo_list.title_balance_not_enough',{symbol:p2pOrder.tokenS}), 3, null, false);
          return
        }
        dispatch({type:'p2pOrder/amountChange', payload:{'amountS':toBig(value)}})
      }
    }
    const submitOrder = ()=>{
      if(!isValidNumber(p2pOrder.amountB) || !Number(p2pOrder.amountB) || !Number(p2pOrder.amountS)) {
        Toast.info(intl.get('notifications.title.invalid_number'), 3, null, false);
        return
      }
      if(!validateAmountS(p2pOrder.amountS)){
        Toast.info(intl.get('todo_list.title_balance_not_enough',{symbol:p2pOrder.tokenS}), 3, null, false);
        return
      }
      dispatch({type:'p2pOrder/isMakerChange', payload:{ismaker:true}})
      showLayer({id:'face2FaceConfirm'})
    }
    const price = p2pOrder.amountB && p2pOrder.amountB.gt(0) && p2pOrder.amountS && p2pOrder.amountS.gt(0) ? toFixed(p2pOrder.amountS.div(p2pOrder.amountB), 8) : toFixed(toBig(0),8)
    return (
      <div className="">
        <div className="zb-b-b p15 ">
          <div className="row ml0 mr0 no-gutters align-items-center justify-content-center">
            <div onClick={showLayer.bind(this,{id:"helperOfTokens",side:'sell'})} className="col d-flex justify-content-center">
              <div className="bg-primary-light text-primary d-flex justify-content-center align-items-center" style={{width:"40px",height:'40px',borderRadius:'50em'}}>
                <i className={`icon-token-${p2pOrder.tokenS} fs24`}/>
              </div>
            </div>
            <div onClick={()=>dispatch({type:'p2pOrder/swap'})} className="col-auto text-center" style={{width:'30px'}}>
              <WebIcon type="swap" className={`text-primary fs18`} />
            </div>
            <div onClick={showLayer.bind(this,{id:"helperOfTokens",side:'buy'})} className="col d-flex justify-content-center">
              <div className="bg-primary-light text-primary d-flex justify-content-center align-items-center" style={{width:"40px",height:'40px',borderRadius:'50em'}}>
                <i className={`icon-token-${p2pOrder.tokenB}  fs24`}/>
              </div>
            </div>
          </div>
          <div className="row ml0 mr0 mt15 no-gutters align-items-stretch justify-content-center" style={{}}>
            <div className="col text-right no-border am-list-bg-none">
              <List  className="selectable">
                <InputItem
                  type="money"
                  onChange={amountChange.bind(this, 'sell')}
                  moneyKeyboardAlign="left"
                  value={toNumber(amountS).toString()}
                  extra={
                    <div className="fs14 cursor-pointer color-black-3 zb-b-l d-flex align-items-center justify-content-end pr10" style={{width:'7.5rem',textAlign:'justify',position:'absolute',right:0,top:'0',bottom:'0',margin:'auto'}} >
                      <div onClick={showLayer.bind(this,{id:"helperOfToken",side:'sell'})}>
                        {p2pOrder.tokenS} <WebIcon className="fs12" style={{marginLeft:"0.3rem"}} type="caret-down"/>
                      </div>
                      <div onClick={showLayer.bind(this,{id:"helperOfAmount",symbol:p2pOrder.tokenS})}  className="fs16 text-primary" style={{position:'absolute',top:'1rem',width:'3.5rem',left:'-3.5rem'}}>
                        <WebIcon type="sliders" />
                      </div>
                    </div>
                  }
                  className="circle h-default fs18"
                  placeholder="Amount To Sell"
                >
                  <div className="fs14 color-black-1" style={{width:'4rem'}}>
                    Sell
                  </div>
                </InputItem>
                <InputItem
                  type="money"
                  onChange={amountChange.bind(this, 'buy')}
                  moneyKeyboardAlign="left"
                  value={toNumber(amountB).toString()}
                  extra={
                    <div onClick={showLayer.bind(this,{id:"helperOfToken",side:'buy'})} className="fs14 cursor-pointer color-black-3 zb-b-l d-flex align-items-center justify-content-end pr10" style={{width:'7.5rem',textAlign:'justify',position:'absolute',right:0,top:'0',bottom:'0',margin:'auto'}} >
                      {p2pOrder.tokenB} <WebIcon className="fs12" style={{marginLeft:"0.3rem"}} type="caret-down"/>
                    </div>
                  }
                  className="circle h-default fs18 mt15"
                  placeholder="Amount To Buy"
                >
                  <div className="fs14 color-black-1" style={{width:'4rem'}}>
                    Buy 
                  </div>
                </InputItem>
                <List.Item
                  className="circle h-default mt15"
                  arrow={false}
                  onClick={()=>{}}
                  extra={
                    <div className="fs14 color-black-4 cursor-pointer pr15 d-flex align-items-center justify-content-center" style={{position:'absolute',right:0,top:'0',bottom:'0',margin:'auto'}} >
                       <Worth amount={price} symbol={p2pOrder.tokenB}/> ≈ {`${price} ${p2pOrder.tokenS}/${p2pOrder.tokenB}`}
                    </div>
                  }
                >
                  <div className="fs14 color-black-1" style={{width:'4rem'}}>
                    Price 
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






