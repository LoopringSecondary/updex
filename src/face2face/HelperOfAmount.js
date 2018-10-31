import React from 'react';
import {connect} from 'dva';
import {Icon, NavBar, Slider} from 'antd-mobile';
import {Icon as WebIcon} from 'antd';
import intl from 'react-intl-universal';
import {toBig, toFixed} from 'LoopringJS/common/formatter'
import {getTokensByMarket} from 'modules/formatter/common'
import TokenFm, * as tokenFormatter from 'modules/tokens/TokenFm'


function HelperOfAmount(props) {
  const tabs = [
    { title: <div className="text-center">{intl.get("common.balance")}</div> },
    { title: <div className="text-center">{intl.get("common.help")}</div> },
  ]
  const {amountPercentage,amountSlider,amountSliderSelected,balances,dispatch,helperOfAmount} = props
  const {symbol} = helperOfAmount
  const balance = tokenFormatter.getBalanceBySymbol({balances, symbol:symbol, toUnit:true})

  const tokenFm = new TokenFm({symbol})

  // const amountPrecision = Math.max(0, right.precision - marketConfig.pricePrecision)
  let availableAmount = toBig(balance.balance)

  const amountSliderChange = (amountPercentage) => {
    dispatch({type:'placeOrderHelper/amountSliderEffects', payload:{percentage:amountPercentage}})
    const amount = availableAmount.times(amountPercentage).div(100)
    dispatch({type:'p2pOrder/amountChange', payload:{'amountS':toBig(tokenFm.toPricisionFixed(amount))}})
  }
  const amountPercentageSelect = (percentage) => {
    dispatch({type:'placeOrderHelper/amountPercentageEffects', payload:{percentage:percentage}})
    const amount = availableAmount.times(percentage).div(100)
    dispatch({type:'p2pOrder/amountChange', payload:{'amountS':toBig(tokenFm.toPricisionFixed(amount))}})
  }
  const hideLayer = (payload = {}) => {
    dispatch({
      type: 'layers/hideLayer',
      payload: {
        ...payload
      }
    })
  }

  const prefix =  ''

  return (
    <div className="bg-white" style={{height:'100%'}}>
      <NavBar
        className="bg-white"
        mode="light"
        onLeftClick={() => hideLayer({id:'helperOfAmountOfP2P'})}
        leftContent={[
          <span key='1' className=""><WebIcon type="close"/></span>,
        ]}
        rightContent={null && [
          <span key='1' onClick={()=>window.Toast.info('请点击价格或数量', 1, null, false)} className=""><WebIcon type="question-circle-o"/></span>,
        ]}
      >
        <div className="color-black">{intl.get('p2p_order.set_sell_amount')}</div>
      </NavBar>
      <div>
        <div className="bg-whitepb15">
          <div className="divider 1px zb-b-b mb15"></div>
          <div className="row pt10 pb10 ml0 mr0 zb-b-b no-gutters align-items-center" onClick={amountPercentageSelect.bind(this, 100)}>
            {amountPercentage === 100 && <div className="pl15 col-auto fs18 color-black-1"><WebIcon type="check-circle" theme="filled" className="text-primary" /></div>}
            {amountPercentage !== 100 && <div className="pl15 col-auto fs18 color-black-1"><WebIcon type="check-circle" theme="" className="color-black-3" /></div>}
            <div className="col color-black-1 text-left pl10">
              100%
            </div>
            <span className="col-auto color-black-3 pr15">{`${prefix} ${tokenFm.toPricisionFixed(availableAmount)} ${symbol}`}</span>
          </div>
          <div className="row pt10 pb10 ml0 mr0 zb-b-b no-gutters align-items-center" onClick={amountPercentageSelect.bind(this, 75)}>
            {amountPercentage === 75 && <div className="pl15 col-auto fs18 color-black-1"><WebIcon type="check-circle" theme="filled" className="text-primary" /></div>}
            {amountPercentage !== 75 && <div className="pl15 col-auto fs18 color-black-1"><WebIcon type="check-circle" theme="" className="color-black-3" /></div>}
            <div className="col color-black-1 text-left pl10">
              75%
            </div>
            <span className="col-auto color-black-3 pr15">{`${prefix} ${tokenFm.toPricisionFixed(availableAmount.times(0.75))} ${symbol}`}</span>
          </div>

          <div className="row pt10 pb10 ml0 mr0 zb-b-b no-gutters align-items-center" onClick={amountPercentageSelect.bind(this, 50)}>
            {amountPercentage === 50 && <div className="pl15 col-auto fs18 color-black-1"><WebIcon type="check-circle" theme="filled" className="text-primary" /></div>}
            {amountPercentage !== 50 && <div className="pl15 col-auto fs18 color-black-1"><WebIcon type="check-circle" theme="" className="color-black-3" /></div>}
            <div className="col color-black-1 text-left pl10">
              50%
            </div>
            <span className="col-auto color-black-3 pr15">{`${prefix} ${tokenFm.toPricisionFixed(availableAmount.times(0.5))} ${symbol}`}</span>
          </div>

          <div className="row pt10 pb10 ml0 mr0 zb-b-b no-gutters align-items-center" onClick={amountPercentageSelect.bind(this, 25)}>
            {amountPercentage === 25 && <div className="pl15 col-auto fs18 color-black-1"><WebIcon type="check-circle" theme="filled" className="text-primary" /></div>}
            {amountPercentage !== 25 && <div className="pl15 col-auto fs18 color-black-1"><WebIcon type="check-circle" theme="" className="color-black-3" /></div>}
            <div className="col color-black-1 text-left pl10">
              25%
            </div>
            <span className="col-auto color-black-3 pr15">{`${prefix} ${tokenFm.toPricisionFixed(availableAmount.times(0.25))} ${symbol}`}</span>
          </div>
          <div className="pt10 pb10 ml0 mr0 zb-b-b">
            
            <div className="pb30 pt20 pl40 pr40">
              <Slider
                className=""
                defaultValue={amountPercentage}
                value={amountPercentage}
                min={0}
                max={100}
                onChange={amountSliderChange}
                onAfterChange={()=>{}}
              />
            </div>
            <div className="color-black-1 text-center fs12 pb10" onClick={amountPercentageSelect.bind(this, 25)}>
              {amountPercentage}%
              <span className="col-auto color-black-3 pr15">{`${prefix} ${tokenFm.toPricisionFixed(availableAmount.times(amountPercentage).div(100))} ${symbol}`}</span>
            </div>
          </div>
          

          <div hidden>
            <div className="row pt15 pb15 ml0 mr0">
              <div className="col color-black-1 text-left pl20">
                <span className="ml5">{amountSlider}%</span>
                <span className="col-auto fs18 color-black-3 ml25">{`${prefix} ${tokenFm.toPricisionFixed(availableAmount.times(amountSlider).div(100))} ${symbol}`}</span>
              </div>
              {amountSliderSelected && <div className="col-auto fs18 color-black-1"><WebIcon type="check-circle-o" /></div>}
            </div>
            <div className="mt15 pb25 pl25 pr20">
              <Slider
                className=""
                defaultValue={amountSlider}
                min={0}
                max={100}
                onChange={amountSliderChange}
                onAfterChange={()=>{}}
              />
            </div>
          </div>
        </div>
        <div className="" style={{maxHeight:'45vh',overflow:'auto'}}>
          <div className="divider 1px zb-b-b"></div>
        </div>
      </div>
    </div>
  )
}
export default connect(({
  placeOrderHelper:{amountPercentage, amountSlider,amountSliderSelected},
  sockets,
})=>({amountPercentage,amountSlider,amountSliderSelected,balances:sockets.balance.items
}))(HelperOfAmount)



