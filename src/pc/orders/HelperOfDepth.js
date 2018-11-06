import React from 'react';
import {Spin, Icon as WebIcon} from 'antd';
import {NoticeBar, Icon} from 'antd-mobile';
import {connect} from 'dva';
import intl from 'react-intl-universal'
import {Toast} from 'antd-mobile';
import Worth from 'modules/settings/Worth'
import {getTokensByMarket} from 'modules/formatter/common'

class HelperOfDepth extends React.Component {
  componentDidMount() {
    const _this = this
    setTimeout(function(){
      let anchorElement = _this.refs.sellEnd;
      if(anchorElement) { anchorElement.scrollIntoView({block: 'end', behavior: 'auto'}); }
    }, 1000)
  }

  componentWillReceiveProps(newProps){
    const _this = this
    setTimeout(function(){
      let anchorElement = _this.refs.sellEnd;
      if(anchorElement) { anchorElement.scrollIntoView({block: 'end', behavior: 'auto'}); }
    }, 1000)
  }

  render(){
    const {depth = {}, pair, maxRows = 15,trades, dispatch} = this.props

    const tokens = getTokensByMarket(pair)
    const sell = depth.item && depth.item.sell ? [...depth.item.sell].reverse() : []
    const changePrice = (value) => {
      // Toast.info('Price has changed', 3, null, false);
      dispatch({
        type: 'placeOrder/priceChangeEffects',
        payload: {
          price: value
        }
      })
    }
    const changeAmount = (value) => {
      // Toast.info('Amount has changed', 3, null, false);
      dispatch({
        type: 'placeOrder/amountChange',
        payload: {
          amountInput: value
        }
      })
    }
    const isIncrease = () => {
      if(trades.items.length===0 || trades.items.length ===1){
        return true
      }else {
        return trades.items[0].price > trades.items[1].price
      }
    };

    return (
      <div className="d-flex flex-column" style={{height: '100%'}}>
        <div className="fs12 position-relative h-100 d-flex flex-column" style={{height:'100%'}}>
          <div className="row no-gutters ml0 mr0 w-100 bg-white" style={{position:'absolute',zIndex:1}}>
            <div style={{width:'40%'}} className="col-auto zb-b-b text-left pl15 pr5 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.price")} </div>
            <div style={{width:'30%'}} className="col-auto zb-b-b text-right pl5 pr5 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.amount")} {tokens.left}</div>
            <div hidden className="col-3 zb-b-b text-right pl5 pr5 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.LRCFee")} LRC</div>
            <div style={{width:'30%'}} className="col-auto zb-b-b text-right pl5 pr15 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.total")} {tokens.right}</div>
          </div>
          <div className="pt30"></div>
          <div className="text-number pt5 pb5 position-relative" style={{flex:1,zIndex:0,overflow:'auto'}}>
              <div className="d-flex flex-column justify-content-end" style={{minHeight:'100%'}}>
                {
                  sell && sell.reverse().map((item, index) =>
                    <div key={index} className="row no-gutters ml0 mr0 w-100">
                      <div style={{width:'40%'}} className="hover-default pl15 pr5 text-left color-error align-top lh20"
                          onClick={changePrice.bind(this, Number(item[0]).toFixed(8))}>
                        {Number(item[0]).toFixed(8)}
                        <span className="fs12 color-black-4 ml5"><Worth amount={Number(item[0]).toFixed(8)}
                                                                        symbol={tokens.right}/></span>
                      </div>
                      <div style={{width:'30%'}} className="hover-default pl5 pr5 color-black-2 text-right lh20"
                          onClick={changeAmount.bind(this, Number(item[1]).toFixed(4))}>
                        {Number(item[1]).toFixed(4)}
                      </div>
                      <div style={{width:'30%'}} className="hover-default pl5 pr15 color-black-2 text-right align-top lh20"
                          onClick={changeAmount.bind(this, Number(item[1]).toFixed(4))}>
                        {Number(item[2]).toFixed(4)}
                      </div>
                    </div>
                  )
                }
              </div>
            <div ref="sellEnd"></div>
          </div>
          <div className="zb-b-t">
            {
              trades.items.length > 0 && !isIncrease() && <div className="text-left pl15 pr15 pt10 pb10 zb-b-b">
                <span className="color-error fs14" onClick={changePrice.bind(this, Number(trades.items[0].price).toFixed(8))}>{trades.items[0].price}</span>
                <span className="color-black-4 fs12 ml10">≈ <Worth amount={Number(trades.items[0].price).toFixed(8)}
                                                                   symbol={tokens.right}/></span>
              </div>
            }
            {
              trades.items.length > 0 && isIncrease() && <div className="text-left pl15 pr15 pt10 pb10 zb-b-b">
                <span className="color-success fs14" onClick={changePrice.bind(this, Number(trades.items[0].price).toFixed(8))}>{trades.items[0].price}</span>
                <span className="color-black-4 fs12 ml10">≈ <Worth amount={Number(trades.items[0].price).toFixed(8)}
                                                                   symbol={tokens.right}/></span>
              </div>
            }
          </div>
          <div className="text-number pt5 pb5 position-relative" style={{flex:1,overflow:'auto',zIndex:0}}>
            {
              depth.item && depth.item.buy && depth.item.buy.map((item, index) =>
                <div key={index} className="row no-gutters ml0 mr0 w-100">
                  <div style={{width:'40%'}} className="hover-default pl15 pr5 text-left color-success align-top lh20"
                      onClick={changePrice.bind(this, Number(item[0]).toFixed(8))}>
                    {Number(item[0]).toFixed(8)}
                    <span className="fs12 color-black-4 ml5"><Worth amount={Number(item[0]).toFixed(8)}
                                                                    symbol={tokens.right}/></span>
                  </div>
                  <div style={{width:'30%'}} className="hover-default pl5 pr5 color-black-2 text-right lh20"
                      onClick={changeAmount.bind(this, Number(item[1]).toFixed(4))}>
                    {Number(item[1]).toFixed(4)}
                  </div>
                  <div style={{width:'30%'}} className="hover-default pl5 pr15 color-black-2 text-right align-top lh20"
                      onClick={changeAmount.bind(this, Number(item[1]).toFixed(4))}>
                    {Number(item[2]).toFixed(4)}
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  ({sockets: {depth,trades}, placeOrder: {pair}}) => ({depth, pair,trades})
)(HelperOfDepth)

