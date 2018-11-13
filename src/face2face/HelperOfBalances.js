import React from 'react';
import {connect} from 'dva';
import {Button} from 'antd-mobile';
import {Icon} from 'antd';
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

class HelperOfBalance extends React.Component {

  state = {
    relatedTokens: []
  }

  render() {
    const {tokenS, tokenB, balance, dispatch} = this.props
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
      <div className="fs20">
        <table className="w-100 fs12">
          <thead>
          <tr className="">
            <th
              className="text-left zb-b-b pl15 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.token')}</th>
            <th
              className="text-left zb-b-b pl5 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.balance')} </th>
            <th className="text-left zb-b-b pl5 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('token_actions.available')}</th>
            <th className="text-center zb-b-b pl5 pr5 pt5 pb5 font-weight-normal color-black-3">{intl.get('token_actions.enable_label_simple')}</th>
            <th
              className="text-right zb-b-b pl5 pr15 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.actions')}</th>
          </tr>
          </thead>
          <tbody>
          {
            relatedTokens.map((token, index) =>{
              return (
                <tr key={index}>
                  <td className="text-left pl15 pr5 pt10 pb10 zb-b-b color-black-2">
                    {token.symbol}
                    <span hidden className="color-black-3 ml5">{token.name} </span>
                  </td>
                  <td className="text-left pl5 pr5 pt10 pb10 zb-b-b color-black-2">
                    <div className="lh15 color-black-1">{toFixed(token.balance, 8)}</div>
                  </td>
                  <td className="text-left pl5 pr5 pt10 pb10 zb-b-b color-black-2">
                    <div className="lh15 color-black-1"><Available symbol={token.symbol}/></div>
                  </td>
                  <td className="text-center pl5 pr5 pt10 pb10 zb-b-b color-black-2">
                    {token.allowance.lt(1e6) &&
                    <EnableSwitch symbol={token.symbol}/>}
                    {token.allowance.gte(1e6) && <Icon type="check-circle" theme="filled" className="color-success"/>}
                  </td>
                  <td className="text-right pl5 pr15 pt10 pb10 zb-b-b color-black-2">
                    {
                      token.symbol === 'WETH' &&
                      <Button className="fs12 d-inline-block pl15 pr15 bg-primary-light text-primary border-none"
                              style={{height: '2.4rem', lineHeight: '2.4rem'}} type="primary" size="small"
                              onClick={showLayer.bind(this, {id: 'helperOfTokenActions', symbol: token.symbol})}>
                        <Icon className="fs10" type="ellipsis"/>
                      </Button>
                    }
                    {
                      token.symbol !== 'WETH' &&
                      <Button className="fs12 d-inline-block pl15 pr15 bg-primary-light text-primary border-none"
                              style={{height: '2.4rem', lineHeight: '2.4rem'}} type="primary" size="small"
                              onClick={showLayer.bind(this, {id: 'helperOfTokenActions', symbol: token.symbol})}>
                        <Icon className="fs10" type="ellipsis"/>
                      </Button>
                    }
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(({
                          p2pOrder: {tokenS, tokenB},
                          sockets,
                        }) => ({
  tokenS, tokenB, balance: sockets.balance.items
}))(HelperOfBalance)





