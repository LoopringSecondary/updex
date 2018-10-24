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
            <div className="col d-flex justify-content-center">
              <div className="bg-primary-light text-primary d-flex justify-content-center align-items-center" style={{width:"40px",height:'40px',borderRadius:'50em'}}>
                <i className={`icon-token-EOS fs24`}/>
              </div>
            </div>
            <div className="col-auto text-center" style={{width:'30px'}}>
              <WebIcon type="swap" className={`text-primary fs18`} />
            </div>
            <div className="col d-flex justify-content-center">
              <div className="bg-primary-light text-primary d-flex justify-content-center align-items-center" style={{width:"40px",height:'40px',borderRadius:'50em'}}>
                <i className={`icon-token-LRC fs24`}/>
              </div>
            </div>
          </div>
          <div className="row ml0 mr0 mt5 no-gutters align-items-center justify-content-center">
            <div className="col d-flex justify-content-center">
             <div className="fs13 color-black-1">EOS <WebIcon className="fs10" type="down"/></div>
            </div>
            <div className="col-auto text-center" style={{width:'30px'}}>
            </div>
            <div className="col d-flex justify-content-center">
              <div className="fs13 color-black-1">LRC <WebIcon className="fs10" type="down"/></div>
            </div>
          </div>
          <div hidden className="row ml0 mr0 mt15 no-gutters align-items-center justify-content-center">
            <div className="col text-center">
              <Button onClick={showLayer.bind(this,{id:'helperOfTokens', side:'buy'})} type="primary" className="fs16 border-none bg-fill color-black-1 d-flex justify-content-center align-items-center pl15 pr15" style={{height:'40px',lineHeight:'40px'}}>
                <span className="ml5">{p2pOrder.tokenB}</span> <WebIcon className="fs12" type="down"/>
              </Button>
            </div>
            <div className="col-auto text-center" style={{width:'15px'}}>
            </div>
            <div className="col text-center">
              <Button onClick={showLayer.bind(this,{id:'helperOfTokens', side:'sell'})} type="primary" className="fs16 border-none bg-fill color-black-1 d-flex justify-content-center align-items-center pl15 pr15" style={{height:'40px',lineHeight:'40px'}}>
                <span className="ml5">{p2pOrder.tokenS}</span> <WebIcon className="fs12" type="down"/>
              </Button>
            </div>
          </div>
          <Button hidden type="primary" className="mt15 fs16 border-none bg-fill color-black-1 mt15" style={{height:'40px',lineHeight:'40px'}}>
            <div className="row ml0 mr0 no-gutters align-items-stretch justify-content-center">
              <div className="col text-center zb-b-r">
                <span><span hidden>{intl.get('common.buy')}</span><span className="ml5">{p2pOrder.tokenB}</span></span>
                <WebIcon className="fs12 ml5" type="down"/>
              </div>
              <div className="col text-center">
                <span><span hidden>{intl.get('common.sell')}</span><span className="ml5">{p2pOrder.tokenS}</span></span>
                <WebIcon className="fs12 ml5" type="down"/>
              </div>
            </div>
          </Button>
          
          <div hidden className="row ml0 mr0 mt15 no-gutters align-items-center justify-content-center">
            <div className="col text-center">
              <Button onClick={showLayer.bind(this,{id:'helperOfTokens', side:'buy'})} type="primary" className="fs16 border-none bg-fill color-black-1 d-flex justify-content-between align-items-center pl15 pr15" style={{height:'40px',lineHeight:'40px'}}>
                <span><span hidden>{intl.get('common.buy')}</span><span className="ml5">{p2pOrder.tokenB}</span></span>
                <WebIcon className="fs12 color-black-4" type="down"/>
              </Button>
            </div>
            <div className="col-auto text-center" style={{width:'15px'}}>
            </div>
            <div className="col text-center">
              <Button onClick={showLayer.bind(this,{id:'helperOfTokens', side:'sell'})} type="primary" className="fs16 border-none bg-fill color-black-1 d-flex justify-content-between align-items-center pl15 pr15" style={{height:'40px',lineHeight:'40px'}}>
                <span><span hidden>{intl.get('common.sell')}</span><span className="ml5">{p2pOrder.tokenS}</span></span>
                <WebIcon className="fs12 color-black-4" type="down"/>
              </Button>
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
                    <div className="fs14 color-black-4 cursor-pointer zb-b-l d-flex align-items-center justify-content-end pr15" style={{width:'6.5rem',position:'absolute',right:0,top:'0',bottom:'0',margin:'auto'}} >
                      {p2pOrder.tokenS} <WebIcon hidden className="fs12 color-black-4 ml5" type="down"/>
                      <div onClick={showLayer.bind(this,{id:"helperOfAmount",symbol:p2pOrder.tokenS})}  className="fs16 text-primary pr10" style={{position:'absolute',top:'1rem',width:'4rem',left:'-4rem'}}>
                        <WebIcon type="sliders" />
                      </div>
                    </div>
                  }
                  className="circle h-default fs18"
                  placeholder="Amount To Sell"
                >
                  <div className="fs14" style={{width:'4rem'}}>
                    Sell 
                  </div>
                </InputItem>
                <InputItem
                  type="money"
                  onChange={amountChange.bind(this, 'buy')}
                  moneyKeyboardAlign="left"
                  value={toNumber(amountB).toString()}
                  extra={
                    <div className="fs14 color-black-4 cursor-pointer zb-b-l d-flex align-items-center justify-content-end pr15" style={{width:'6.5rem',position:'absolute',right:0,top:'0',bottom:'0',margin:'auto'}} >
                      {p2pOrder.tokenB} <WebIcon hidden className="fs12 color-black-4 ml5" type="down"/>
                    </div>
                  }
                  className="circle h-default fs18 mt15"
                  placeholder="Amount To Buy"
                >
                  <div className="fs14" style={{width:'4rem'}}>
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
                  <div className="fs14" style={{width:'4rem'}}>
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






