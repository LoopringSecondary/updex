import React from 'react';
import {connect} from 'dva';
import {Button} from 'antd-mobile';
import {Icon,Spin} from 'antd';
import EnableSwitch from '../dex/tokens/EnableSwitch';
import routeActions from 'common/utils/routeActions'
import {getTokensByMarket} from 'modules/formatter/common'
import TokenFM, {getBalanceBySymbol} from 'modules/tokens/TokenFm'
import {FormatAmount} from 'modules/formatter/FormatNumber'
import {formatLength, toBig, toFixed, toHex, toNumber} from "LoopringJS/common/formatter";
import intl from 'react-intl-universal'
import config from "../common/config";
import storage from 'modules/storage'
import mapLimit from 'async/mapLimit';
import Available from 'modules/tokens/Available'
import TokenFm from "modules/tokens/TokenFm";

class HelperOfBalance extends React.Component {

  state = {
    relatedTokens: []
  }

  render() {
    const {tokenS, tokenB, balance, loading,dispatch} = this.props
    const relatedTokens = []
    const balanceS = {
      symbol: tokenS,
      name: tokenS,
      ...getBalanceBySymbol({balances: balance, symbol: tokenS.toLowerCase(), toUnit: true}),
    }
    const balanceB = {
      symbol: tokenB,
      name: tokenB,
      ...getBalanceBySymbol({balances: balance, symbol: tokenB, toUnit: true})
    }
    relatedTokens.push(balanceS)
    relatedTokens.push(balanceB)

    const showLayer = (payload = {}) => {
      dispatch({
        type: 'layers/showLayer',
        payload: {
          ...payload
        }
      })
    }

    // if(tokenS === 'WETH' || tokenB === 'WETH') {
    //   relatedTokens.push({
    //     symbol:'ETH',
    //     name:'ETH',
    //     ...tokenFormatter.getBalanceBySymbol({balances:balance, symbol:'ETH', toUnit:true})
    //   })
    // }
    const gotoReceive = ({symbol}) => {
      showLayer({id: 'receiveToken', symbol})
    }
    const gotoConvert = ({type}) => {
      routeActions.gotoPath(`/dex/convert/${type}`)
    }
    const gotoAll = (payload) => {
    }

    const available = (token) => {
      const value = token.balance.minus(token.sale)
      return value.gt(0) ? toFixed(value, 8) : 0
    }

    return (
      <Spin spinning={loading} className="fs20">
        <table className="w-100 fs12">
          <thead>
          <tr className="">
            <th
              className="text-left zb-b-b pl15 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.token')}</th>
            <th
              className="text-left zb-b-b pl5 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.balance')} </th>
            <th className="text-left zb-b-b pl5 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.available')}</th>
            <th className="text-center zb-b-b pl5 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('token_actions.enable_label_simple')}</th>
            <th
              className="text-right zb-b-b pl5 pr15 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.actions')}</th>
          </tr>
          </thead>
          <tbody>
          {
            relatedTokens.map((token, index) =>{
              const tf = new TokenFm({symbol:token.symbol})
              return (
                <tr key={index} className="hover-default" onClick={()=>{showLayer({id:'helperOfTokenActions',symbol:token.symbol,hideBuy:true})}}>
                  <td className="text-left pl15 pr5 pt10 pb10 zb-b-b color-black-2">
                    {token.symbol}
                    <span hidden className="color-black-3 ml5">{token.name} </span>
                  </td>
                  <td className="text-left pl5 pr5 pt10 pb10 zb-b-b color-black-2">
                    <div className="lh15 color-black-1">{tf.shorterPrecision(token.balance)}</div>
                  </td>
                  <td className="text-left pl5 pr5 pt10 pb10 zb-b-b color-black-2">
                    <div className="lh15 color-black-1"><Available symbol={token.symbol}/></div>
                  </td>
                  <td className="text-center pl5 pr5 pt10 pb10 zb-b-b color-black-2">
                    <EnableSwitch symbol={token.symbol}/>
                  </td>
                  <td className="text-right pl5 pr15 pt10 pb10 zb-b-b color-black-2">
                    {
                      token.symbol === 'WETH' &&
                      <Button className="fs12 d-inline-block pl15 pr15 mr10 bg-primary-light text-primary border-none h-25 lh-25" type="primary" size="small" onClick={(e)=>{e.stopPropagation();showLayer({id:'convertToken',type:"WETH"})}}>{intl.get('common.convert')}</Button>
                    }
                    <Button className="fs12 d-inline-block pl15 pr15 bg-primary-light text-primary border-none h-25 lh-25" type="primary" size="small" onClick={(e) => {e.stopPropagation();gotoReceive({symbol:token.symbol})}}>{intl.get('common.receive')}</Button>
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </Spin>
    )
  }
}

export default connect(({
                          p2pOrder: {tokenS, tokenB},
                          sockets,
                        }) => ({
  tokenS, tokenB, balance: sockets.balance.items,loading: sockets.balance.loading
}))(HelperOfBalance)





