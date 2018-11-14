import React from 'react'
import {FillFm} from 'modules/fills/formatters'
import {Spin} from 'antd'
import intl from 'react-intl-universal'
import config from 'common/config'
import {Pagination} from "antd-mobile";
import {getShortAddress} from 'modules/formatter/common'


const ListItem = ({item})=>{
  const fillFm = new FillFm(item)
  return (
    <div className="fs12 pt10 pb10 zb-b-b">
      <div className="row no-gutters ml0 mr0 pb5">
        <div className="col text-left pl10 ">
          <a href={`https://etherscan.io/tx/${fillFm.getTxHash()}`} target="_blank" className="text-primary cursor-pointer">{getShortAddress(fillFm.getTxHash())}</a>
          <span className="color-black-3"> ( txHash ) </span>
        </div>
        <div className="col-auto pr10">
          <div className="color-black-3">{fillFm.getCreateTime()}</div>
        </div>
      </div>
      <div className="row no-gutters ml0 mr0">
        <div className="col-6 text-left pl10">
          <div className="color-black-2">
              <span style={{width:'3.5rem'}} className="d-inline-block color-black-2">{intl.get('common.sell')}</span>
              {fillFm.getSell()}
          </div>
          <div className="color-black-2">
            <span style={{width:'3.5rem'}} className="d-inline-block color-black-2">{intl.get('common.buy')}</span>
            {fillFm.getBuy()}
          </div>
        </div>
        <div className="col-6 text-right pr10">
          <div className="color-black-2">
            {fillFm.getPrice()} {fillFm.getMarket()}
            <span style={{width:'3.5rem'}} className="d-inline-block color-black-2">{intl.get('common.price')}</span>
          </div>
          <div className="color-black-2">
            {fillFm.getLRCFee()}
            <span style={{width:'3.5rem'}} className="d-inline-block color-black-2">{intl.get('common.fee')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default class Fills extends React.Component {
  state = {
    pageSize: 50,
    pageIndex: 1,
    total: 0,
    loading: true,
    fills: []
  };

  componentDidMount() {
    const {pageSize, pageIndex} = this.state;
    const {order} = this.props;
    let hash = order.originalOrder.hash
    window.RELAY.ring.getFills({delegateAddress:order.originalOrder.delegateAddress, pageSize, pageIndex, orderHash: hash, orderType:order.originalOrder.orderType}).then(res => {
      if (!res.error) {
        const total = Math.ceil(res.result.total / pageSize)
        this.setState({fills: res.result.data, loading: false, total})
      }else{
        this.setState({fills: [], loading: false, total: 0})
      }
    })
  }

  onChange = (page) => {
    const {order} = this.props;
    const {pageSize} = this.state;
    this.setState({loading: true, pageIndex: page, pageSize})
    window.RELAY.ring.getFills({delegateAddress:order.originalOrder.delegateAddress, pageIndex: page, pageSize, orderHash: order.originalOrder.hash, orderType:order.originalOrder.orderType}).then(res => {
      if (!res.error) {
        const total = Math.ceil(res.result.total / pageSize)
        this.setState({fills: res.result.data, loading: false, total})
      }else{
        this.setState({fills: [], loading: false, total: 0})
      }
    })
  }

  render(){
    const {fills,loading,pageSize,pageIndex,total} = this.state;
    return(
      <div className="">
        <Spin spinning={loading} >
          <div>
            { fills.map((item,index)=> <ListItem  key={index} item={item} />) }
            { !loading && fills.length === 0 &&
                <div className="pt10 pb10 pl5 pr5 text-center color-black-4 fs13" colSpan='100'>
                  {intl.get("common.list.no_data")}
                </div>
            }
            {
              fills && fills.length > 0 && total > 1 &&
              <div className="p5">
                <Pagination className="fs14 s-small custom-pagination" total={total} current={pageIndex} onChange={this.onChange}/>
              </div>
            }
         </div>
        </Spin>
      </div>
    )
  }
}
