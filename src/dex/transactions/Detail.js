import React from 'react'
import { Icon } from 'antd'
import { NavBar, Button } from 'antd-mobile'
import intl from 'react-intl-universal'
import { connect } from 'dva'
import routeActions from 'common/utils/routeActions'
import Worth from 'modules/settings/Worth'
import { TxFm } from "modules/transactions/formatters";
import {getShortAddress} from 'modules/formatter/common'
import {MetaItem} from 'LoopringUI/components/Metas'


function TxDetail(props) {
  const {dispatch} = props
  // if(!order){
  //   return null
  // }
  const showLayer = (payload={})=>{
    dispatch({
      type:'layers/showLayer',
      payload:{
        ...payload
      }
    })
  }
  const hideLayer = (payload={})=>{
    dispatch({
      type:'layers/hideLayer',
      payload:{
        ...payload
      }
    })
  }
  
  const txDetail = {
    "blockHash": "0x6f707a0951e9543f9ad1980e153569a08a8b8acce64a64716afdfc24f3259cfc",
    "blockNumber": "0x678b16",
    "from": "0x64f2741920b7df046b7fe8df2e6b0bead2452bea",
    "gas": "0x61a80",
    "gasPrice": "0x2540be400",
    "hash": "0xa166ba3f4dc091b5dc903f996ed4f0e98eb100f86dfc9dd5365527524560dc32",
    "input": "0xe78aadb20000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000003e0000000000000000000000000000000000000000000000000000000000000044000000000000000000000000000000000000000000000000000000000000004a0000000000000000000000000000000000000000000000000000000000000054000000000000000000000000000000000000000000000000000000000000005e000000000000000000000000064f2741920b7df046b7fe8df2e6b0bead2452bea0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000064f2741920b7df046b7fe8df2e6b0bead2452bea000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000003bed9c733084ed3a19e44827135408a8b4bba45100000000000000000000000005454d111a1b4057f2c511b5a78045db33dbff69000000000000000000000000d02323de710729f065a4defbda0c6148c6bac649000000000000000000000000ef68e7c694f40c8202821edf525de3782458639f0000000000000000000000003bed9c733084ed3a19e44827135408a8b4bba4510000000000000000000000000a64305c579e068b4a1745bde3aa35ff7918217c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000e35fa931a00000000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000000000000000000000000000000000005bfdf701000000000000000000000000000000000000000000000000000000005c00a8110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e35fa931a00000000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000000000000000000000000000000e35fa931a0000000000000000000000000000000000000000000000000000000000005bfdf6be000000000000000000000000000000000000000000000000000000005c2591ce00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008ac7230489e800000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001b000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001b00000000000000000000000000000000000000000000000000000000000000048b84f6aa5367d8603be2bebb3512854896614a19dee0bbca61add534be32e52b540b119247f23b794b6aeb12ae27e02540eff940e1a7b95f5c3c2a8bb15cfdb66a305c6b926b0006c455ac71bdc4aee018e95e0b90f23ca1fb8b2872fd87d5a2e88aa8209c09f60185151a8939987498fc39a728ac683cb44f76383b2b52faab00000000000000000000000000000000000000000000000000000000000000043a0cf2d258ede583e0d2888a7a4101d6b833244c1486a8ee7f3b09771f5efed73eaf4da9388360ed08e84a9177c5001a9dffd85a106304712096ad76ddd6167214c34690de863bcc3a71d44f3e2a9c9c2d4e7de7fba89fa4afa0a4e6e0e7633d3b1fdf67d2b74bed4c0891d749b10f688ab6f1bb3eb9ef929e95f4eb817b8939",
    "nonce": "0x7",
    "to": "0x8d8812b72d1e4ffcec158d25f56748b7d67c1e78",
    "transactionIndex": "0x25",
    "value": "0x0",
    "v": "0x25",
    "r": "0xad47d427ce565a5ca794aa498eb31a94043a01027ed11e7a159fc7103413db8d",
    "s": "0x7ef525d032640d098d4f6c0eb6329249687f43bab5ffab9d395194f819e178d8"
  }
  const txFm = new TxFm(txDetail)
  return (
    <div className="bg-fill d-flex-column" style={{height:"100%"}}>
      <NavBar
        className="bg-white"
        mode="light"
        onLeftClick={()=>hideLayer({id:'txDetail'})}
        leftContent={[
          <span key='1' className=""><Icon type="close"/></span>,
        ]}
        rightContent={null && [
          <Icon key="1" type="question-circle-o"/>,
        ]}
      >
        <div className="color-black">{intl.get('tx_detail.detail_title')}</div>
      </NavBar>
      <div className="bg-white"><div className="divider 1px zb-b-t"></div> </div>
      <div style={{flex:1,overflow:'auto'}}>
        <div className="bg-white mt10">
          <div className="fs14 color-black-1 pl15 pr15 pt10 pb10 text-left zb-b-b">{intl.get('tx.status')}</div>
          <MetaItem className="fs12" label={intl.get('tx.status')} value={
            <div className="text-nowrap d-flex align-items-center">
              <span className="mr10">
                <Button onClick={()=>showLayer({id:'resend'})} className="d-inline-block h-25 center-center fs12" size="small" type="primary">Resend</Button>
              </span>
              <span className="color-black-1">Pending</span>
            </div>
          }/>
          <MetaItem className="fs12" label={intl.get('tx.created')} value={
            <div>
              <span className="color-black-2 fs12 mr10">(1小时前{txFm.getFromNow()})</span>
              <span className="color-black-1 fs12">2018-10-10 10:00:00{txFm.getCreateTime()}</span>
            </div>
          }/>
          <MetaItem className="fs12" label={"Confirmations"} value={
            <div>
              <span className="color-black-1 fs12">0</span>
            </div>
          }/>
        </div>
        <div className="bg-white mt10">
          <div className="fs14 color-black-1 pl15 pr15 pt10 pb10 text-left zb-b-b">Basic</div>
          <MetaItem className="fs12" label={intl.get('tx.type')} value={txFm.getType()}/>
          <MetaItem className="fs12" label={intl.get('tx.txHash')} value={getShortAddress(txFm.getTxHash())}/>
          <MetaItem className="fs12" label={intl.get('tx.to')} value={getShortAddress(txFm.getTo())}/>
          <MetaItem className="fs12" label={intl.get('tx.value')} value={txFm.getValue() + ' ETH'} />
          <MetaItem className="fs12" label={intl.get('tx.gas')} value={txFm.getGas()}/>
          {false && <MetaItem className="fs12" label={intl.get('tx.confirm_time')} value={txFm.getConfirmTime()}/> }
          { false && <MetaItem className="fs12" label={intl.get('tx.block')} value={txFm.getBlockNum()}/> }
          { false && <MetaItem className="fs12" label={intl.get('tx.nonce')} value={txFm.getNonce()}/> }
        </div>
        {
          false &&
          <div className="bg-white mt10">
            <MetaItem className="fs12" label={intl.get('common.sell')} value={'xxx'}/>
            <MetaItem className="fs12" label={intl.get('common.buy')} value={'xxx'}/>
          </div>
        }
      </div>
      <div className="row no-gutters p15 mt10 bg-white">
        <div className="col-6 pr10">
          <Button className="fs14" size="" type="primary" className="text-normal fs14">Copy TxHash</Button>
        </div>
        <div className="col-6">
          <Button className="fs14" size="" type="primary" className="text-normal fs14">Etherscan.io</Button>
        </div>
      </div>
    </div>
  )
}
export default connect()(TxDetail)
