import React from 'react';
import {connect} from 'dva';
import { Modal,List,Button,NavBar,Icon} from 'antd-mobile';
import intl from 'react-intl-universal';
import config from '../../common/config'
import routeActions from 'common/utils/routeActions'


function HelperOfTokenActions(props) {
  const {helperOfTokenActions,dispatch} = props
  const {symbol,hideBuy} = helperOfTokenActions
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
    <div className="p0" style={{width:'24rem'}}>
        <NavBar
          className="zb-b-b d-none"
          mode="light"
          onLeftClick={() => hideLayer({id:'helperOfTokenActions'})}
          leftContent={null && [
            <span key='1' className=""><Icon type="cross"/></span>,
          ]}
        >
          <div className="fs14 text-left">{symbol} {intl.get('common.actions')}</div>
        </NavBar>
        <div className="p10">
          <Button size="small" onClick={showReceive} className="fs14" type="primary">{intl.get('common.receive')} {symbol}</Button>
          {
            isSupportedTrading() && !hideBuy &&
            <Button size="small" onClick={gotoTrading} className="mt10 fs14" type="primary">{intl.get('common.buy')} {symbol}</Button>
          }

          {
            (false && symbol.toUpperCase() !== 'WETH' && symbol.toUpperCase() !== 'ETH') &&
            <Button size="small" onClick={()=>window.toast('ComingSoon')} disabled className="mt10 fs14" type="">Enable {symbol}</Button>
          }
          {symbol === 'WETH' &&
                <Button size="small" className="mt10 fs14" type="primary" onClick={() => {showConvert("ETH")}}>{intl.get('convert.convert_eth_title')}</Button>
          }
          {
            symbol === 'ETH' &&
            <Button size="small" onClick={gotoTrading} className="mt10 fs14" type="primary"> {intl.get('convert.convert_weth_title')}</Button>
          }
        </div>
    </div>
  )
}
export default connect()(HelperOfTokenActions)
