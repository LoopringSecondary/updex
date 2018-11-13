import React from 'react';
import {connect} from 'dva';
import {List,Button,NavBar,Icon} from 'antd-mobile';
import intl from 'react-intl-universal';
import config from '../../common/config'
import routeActions from 'common/utils/routeActions'
import EnableSwitch from './EnableSwitch'
import  TokenFormatter from 'modules/tokens/TokenFm'
import {toNumber,toBig} from 'LoopringJS/common/formatter'
import storage from 'modules/storage'


const MetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pt10 pb10 pl15 pr15 zb-b-b no-gutters align-items-center" style={{padding:'7px 0px'}}>
      <div className="col">
        <div className="fs14 color-black-2 text-left">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs14 color-black-2 text-wrap text-left">{value}</div>
      </div>
    </div>
  )
}

class HelperOfTokenActions extends  React.Component{

  state={
    sale:0
  }

  componentWillMount(){

    const {helperOfTokenActions} = this.props
    const {symbol} = helperOfTokenActions
    const tokenFm = new TokenFormatter({symbol})
    const owner = (window.Wallet && window.Wallet.address) || storage.wallet.getUnlockedAddress()
    window.RELAY.account.getEstimatedAllocatedAllowance({owner,delegateAddress:config.getDelegateAddress(),token:symbol}).then(res => {
      if(res.result){
        let sale = toBig(res.result)
        this.setState({sale:tokenFm.toPricisionFixed(tokenFm.getUnitAmount(sale))})
      }
    })


  }

  render(){
    const {helperOfTokenActions,balances,dispatch} = this.props
    const {symbol,hideBuy} = helperOfTokenActions
    const balance  = balances.find(item =>item.symbol.toLowerCase() === symbol.toLowerCase())
    const tokenFm = new TokenFormatter({symbol})
    const {sale} =  this.state
    const available = tokenFm.getUnitAmount(balance.balance).minus(sale)


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
    const showReceive = (payload = {})=>{
      hideLayer({id:'helperOfTokenActions'})
      showLayer({id:'receiveToken',symbol})
    }

    const showConvert = (token) => {
      hideLayer({id:'helperOfTokenActions'})
      routeActions.gotoPath(`/dex/convert/${token}`)
    }

    const isSupportedTrading = () => {
      const market = config.getTokenSupportedMarket(symbol)
      return !!market
    }
    const gotoTrading = () => {
      hideLayer({id:'helperOfTokenActions'})
      const market = symbol.toLowerCase() === 'lrc'? 'LRC-WETH' : config.getTokenSupportedMarket(symbol)
      if (market) {
        routeActions.gotoPath(`/dex/placeOrder/${market}`)
        return
      }
      routeActions.gotoPath(`/dex/placeOrder`)
    }

    return (
      <div className="bg-white h100">
        <NavBar
          className="zb-b-b"
          mode="light"
          onLeftClick={() => hideLayer({id:'helperOfTokenActions'})}
          leftContent={[
            <span key='1' className=""><Icon type="cross"/></span>,
          ]}
        >
          <div className="color-black">{symbol}</div>
        </NavBar>
        <div className="pt15">
          <MetaItem  label={"Balance total"} value={toNumber(tokenFm.toPricisionFixed(tokenFm.getUnitAmount(balance.balance)))}/>
          <MetaItem  label={"Balance on sale"} value={toNumber(sale)}/>
          {available.gte(0) && <MetaItem  label={"Balance available"} value={toNumber(tokenFm.toPricisionFixed(available))}/>}
          {available.lt(0) && <MetaItem  label={"Balance lack"} value={toNumber(tokenFm.toPricisionFixed(available.times(-1)))}/>}
          <MetaItem  label={"Tradable"} value={<EnableSwitch symbol={symbol} />}/>
          <div className="divider 1px zb-b-t"></div>
          <div className="">
            {symbol === 'WETH' &&
            <Button className="m10 fs14" type="primary" onClick={() => {showConvert("ETH")}}>{intl.get('convert.convert_eth_title')}</Button>
            }
            {
              symbol === 'ETH' &&
              <Button onClick={() => {showConvert("WETH")}} className="m10 fs14" type="primary"> {intl.get('convert.convert_weth_title')}</Button>
            }
            {
              false && isSupportedTrading() && !hideBuy &&
              <Button onClick={gotoTrading} className="mt10" type="primary">{intl.get('common.buy')} {symbol}</Button>
            }
            <Button onClick={showReceive} className="m10 fs14" type="primary">{intl.get('common.receive')} {symbol}</Button>
            {
              false && symbol !== 'ETH' &&
              <List.Item arrow="horizontal" extra="5" disabled>
                View {symbol} Orders
              </List.Item>
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {

  return {
    balances:state.sockets.balance.items
  }

}


export default connect(mapStateToProps)(HelperOfTokenActions)
