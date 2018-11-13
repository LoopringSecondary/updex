import React from 'react'
import {FillFm} from 'modules/fills/formatters'
import {Spin} from 'antd'
import intl from 'react-intl-universal'
import config from 'common/config'
import {Pagination} from "antd-mobile";

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
          <table className="w-100 fs13">
            <thead>
              <tr className="">
                <th className="zb-b-b text-left pl10 pr5 pt10 pb10 font-weight-normal color-black-3 ">{intl.get('common.amount')}</th>
                <th className="zb-b-b text-left pl10 pr5 pt10 pb10 font-weight-normal color-black-3 ">{intl.get('common.price')}</th>
                <th className="zb-b-b text-right pl5 pr10 pt10 pb10 font-weight-normal color-black-3 ">{intl.get('order.LRCFee')}</th>
              </tr>
            </thead>
            <tbody>
                {
                  fills.map((item,index)=>{
                    const fillFm = new FillFm(item)
                    return (
                      <tr key={index}>
                        <td className="pl10 pr5 pt10 pb10 zb-b-b color-black-1 text-left align-middle ">
                         <div><span className="color-success d-inline-block mr5">{intl.get('common.buy')}</span> {fillFm.getBuy()}</div>
                         <div><span className="color-error d-inline-block mr5">{intl.get('common.sell')}</span> {fillFm.getSell()}</div>
                        </td>
                        <td className="pl10 pr10 pt10 pb10 zb-b-b text-left  align-middle text-nowrap">
                          <div className="color-black-1">{fillFm.getPrice()} </div>
                          <div className="color-black-3">{fillFm.getCreateTime()}</div>
                        </td>
                        <td className="pl10 pr10 pt10 pb10 zb-b-b color-black-1 text-right align-middle ">
                         {fillFm.getLRCFee()}
                        </td>
                        <td hidden className="pl10 pr5 pt10 pb10 zb-b-b text-left align-middle">
                          { item.side === 'buy' && <div className="color-success">{intl.get('common.buy')}</div> }
                          { item.side === 'sell' && <div className="color-error">{intl.get('common.sell')}</div> }
                        </td>
                        <td hidden className="pl5 pr5 pt10 pb10 zb-b-b text-right color-black-2 align-middle text-nowrap">
                          {fillFm.getLRCFee()}
                        </td>
                      </tr>
                    )
                  })
                }
                {
                  !loading && fills.length === 0 &&
                  <tr>
                    <td className="pt10 pb10 pl5 pr5 text-center color-black-4 fs13" colSpan='100'>
                      {intl.get("common.list.no_data")}
                    </td>
                  </tr>
                }
            </tbody>
          </table>
          {
            fills && fills.length > 0 && total > 1 &&
            <div className="p5">
              <Pagination className="fs14 s-small custom-pagination" total={total} current={pageIndex} onChange={this.onChange}/>
            </div>
          }
          {
            (!fills || fills.length === 0 || total <= 1) &&
            <div className="pt10" />
          }
        </Spin>
      </div>
    )
  }
}
