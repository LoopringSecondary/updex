import React from 'react'
import {Icon} from 'antd'
import {connect} from 'dva'
import QRCode from 'qrcode.react'
import Worth from 'modules/settings/Worth'
import intl from 'react-intl-universal'
import TokenFm from "modules/tokens/TokenFm";
import {toFixed, toNumber,toBig} from 'LoopringJS/common/formatter'
import {share} from '../common/utils/signUtils'
import storage from 'modules/storage'
import QRCodeNode from 'qrcode'

const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pt10 pb10  zb-b-b no-gutters align-items-center" style={{padding: '7px 0px'}}>
      <div className="col">
        <div className="fs14 color-black-1 text-left">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs14 color-black-2 text-wrap text-right">{value}</div>
      </div>
    </div>
  )
}

class OrderQrcode extends React.Component {

  render() {
    const {value, data: {orderFm, tokens}} = this.props.orderQrcode
    const {dispatch} = this.props
    const {originalOrder: {tokenS, tokenB, amountS, amountB, validUntil}} = orderFm.order
    const tokensFm = new TokenFm({symbol: tokenS})
    const tokenbFm = new TokenFm({symbol: tokenB})
    let qrcodeContent = JSON.stringify(value)
    if(storage.wallet.getUnlockedType() === 'imtoken' || true) {
        const url = window.location.href.split('#')[0].concat('#/auth/imtoken')
       qrcodeContent = url.concat(`?to=\/dex\/scan&type=P2P&auth=${value.value.auth}&hash=${value.value.hash}&count=${value.value.count}`);
    }
    const shareOrder = () => {
      let content;
      const tokensFm = new TokenFm({symbol: tokenS})
      const tokenbFm = new TokenFm({symbol: tokenB})
      QRCodeNode.toDataURL(qrcodeContent,function (err, url) {

        content = {}
        content.title = intl.get('common.loopring_p2p');
        // content.message = `${intl.get('common.loopring_p2p')}:${toNumber(tokensFm.toPricisionFixed(tokensFm.getUnitAmount(amountS).div(value.value.count)))} ${tokenS} => ${toNumber(tokenbFm.toPricisionFixed(tokenbFm.getUnitAmount(amountB).div(value.value.count)))} ${tokenB}`;
        content.url = url
        content.type='image/png'
        console.log(url)
        share(content)
      })

      return;

      if (storage.wallet.getUnlockedType() === 'imtoken') {
        content = {}
        content.title = intl.get('common.loopring_p2p');
        content.message = `${intl.get('common.loopring_p2p')}:${toNumber(tokensFm.toPricisionFixed(amountS.div(value.value.count)))} ${tokenS} => ${toNumber(tokenbFm.toPricisionFixed(amountB.div(value.value.count)))} ${tokenB}`;
        content.url = qrcodeContent
      } else {
        content = {type: 'p2pOrder', content: qrcodeContent}
        content.extra = {
          validUntil: validUntil.unix().toString(),
          amountB: tokenbFm.toPricisionFixed(amountB),
          amountS: tokensFm.toPricisionFixed(amountS),
          tokenS,
          tokenB
        }
      }
      share(content)
    };
    const hideLayer = (payload = {}) => {
      dispatch({
        type: 'layers/hideLayer',
        payload: {
          ...payload
        }
      })
    }
    const fillCount = Math.ceil(toNumber(orderFm.getFilledPercent()) / 100 * value.value.count)


    return (
      <div className="bg-white">
        <div className="p15 color-black-1 fs18 zb-b-b text-center no-gutters">
          <div className="row">
            <div className="col-auto text-left pl20 pr20">
              <Icon type='close' className="text-primary" onClick={() => hideLayer({id: 'orderQrcode'})}/>
            </div>
            <div className="col">{intl.get('p2p_order.user_center_p2p')}</div>
            <div className="col-auto color-white pl20 pr20">
             <Icon type='share-alt' className="text-primary" onClick={shareOrder}/>
            </div>
          </div>
        </div>
        <div className="text-center mt15">
          <div className="p15 d-inline-block" style={{background: '#fff'}}>
            <QRCode  value={qrcodeContent} size={240} level='H'/>
          </div>
        </div>
        <div className="m15 zb-b-t p15 text-center">
          <OrderMetaItem label={intl.get('common.sell')} value={orderFm.getSell()}/>
          <OrderMetaItem label={intl.get('common.buy')} value={orderFm.getBuy()}/>
          <OrderMetaItem label={intl.get('common.buy') + ' ' + intl.get('order.price')} value={
            <span>
                  {`1 ${tokenB} = ${Number(toFixed(tokensFm.getUnitAmount(amountS).div(tokenbFm.getUnitAmount(amountB)), 8))} ${tokenS} ≈`}
              <Worth amount={tokensFm.getUnitAmount(amountS).div(tokenbFm.getUnitAmount(amountB))} symbol={tokenS}/>
                </span>
          }/>

          <OrderMetaItem label={intl.get('common.sell') + ' ' + intl.get('order.price')} value={
            <span>
                  {`1 ${tokenS} = ${Number(toFixed(tokenbFm.getUnitAmount(amountB).div(tokensFm.getUnitAmount(amountS)), 8))} ${tokenB} ≈`}
              <Worth amount={tokenbFm.getUnitAmount(amountB).div(tokensFm.getUnitAmount(amountS))} symbol={tokenB}/>
                </span>
          }/>

          {false && <OrderMetaItem label={intl.get('order.price')} value={
            <div>
              <span className="color-black-4 pr5"><Worth amount={orderFm.getPrice()}
                                                         symbol={tokens.right}/></span> {Number(orderFm.getPrice())} {tokens.right}
            </div>
          }/>}
          <OrderMetaItem label={intl.get('common.ttl')} value={orderFm.getValidTime()}/>
          <OrderMetaItem label={intl.get('order.filled')}
                         value={`${orderFm.getFilledPercent()}% （${fillCount}/${value.value.count}）`}/>
          <OrderMetaItem label={intl.get('p2p_order.fill_amount')} value={`${orderFm.getFilledAmount(true, true)}`}/>
        </div>
      </div>
    )
  }
}

export default connect()(OrderQrcode)
