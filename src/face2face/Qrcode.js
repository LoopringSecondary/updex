import React from 'react'
import { Icon } from 'antd'
import QRCode from 'qrcode.react'
import Worth from 'modules/settings/Worth'
import intl from 'react-intl-universal'


const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pt10 pb10 pl15 pr15 zb-b-b no-gutters align-items-center" style={{padding:'7px 0px'}}>
      <div className="col">
        <div className="fs14 color-black-1 text-left">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs14 color-black-2 text-wrap text-left">{value}</div>
      </div>
    </div>
  )
}

export default class OrderQrcode extends React.Component{

  render(){
    const {value,data:{orderFm,tokens}} = this.props.orderQrcode
    return(
      <div className="div">
        <div className="p15 color-black-1 fs18 zb-b-b text-center no-gutters">
          <div className="row">
            <div className="col-auto text-left pl20 pr20">
            </div>
            <div className="col"> P2P Order</div>
            <div className="col-auto color-white pl20 pr20">
              <Icon type="left"/>
            </div>
          </div>
        </div>
        <div className="bg-white p15 text-center">
          <QRCode value={JSON.stringify(value)} size={240} level='H'/>
        </div>
        <div className="bg-white p15 text-center">
          <OrderMetaItem label={intl.get('order.price')} value={
            <div>
              <span className="color-black-4 pr5"><Worth amount={orderFm.getPrice()} symbol={tokens.right}/></span> {orderFm.getPrice()} { tokens.right }
            </div>
          }/>
          <OrderMetaItem label={intl.get('common.sell')} value={orderFm.getSell()}/>
          <OrderMetaItem label={intl.get('common.buy')} value={orderFm.getBuy()}/>
          <OrderMetaItem label={intl.get('common.ttl')} value={orderFm.getValidTime()}/>
        </div>
      </div>
    )
  }
}
