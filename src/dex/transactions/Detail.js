import React from 'react'
import { Icon } from 'antd'
import { NavBar, NoticeBar } from 'antd-mobile'
import intl from 'react-intl-universal'
import { connect } from 'dva'
import routeActions from 'common/utils/routeActions'
import Worth from 'modules/settings/Worth'

const MetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pl15 pr15 pt10 pb10 zb-b-b no-gutters align-items-center" style={{padding:'7px 0px'}}>
      <div className="col">
        <div className="fs14 color-black-2 text-left">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs14 color-black-2 text-wrap text-left">{value}</div>
      </div>
    </div>
  )
}

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
  const renderType = ()=>{

  }
  const renderStatus = ()=>{

  }
  const renderGas = ()=>{
    return (
      <div className="mr15">
        <div className="row justify-content-end">{`00  ETH`}</div>
        <div className="row justify-content-end fs14 color-black-3">{`Gas( 00 ) * Gas Price( 00 Gwei)`}</div>
      </div>
    )
  }

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
      <div style={{flex:1}}>
        <div className="bg-white mt10">
          <MetaItem label={intl.get('tx.type')} value={'xxx'}/>
          <MetaItem label={intl.get('tx.status')} value={'xxx'}/>
          <MetaItem label={intl.get('tx.txHash')} value={'xxx'}/>
          <MetaItem label={intl.get('tx.to')} value={'xxx'}/>
          <MetaItem label={intl.get('tx.value')} value={'xx'} />
          <MetaItem label={intl.get('tx.gas')} value={'xx'}/>
          <MetaItem label={intl.get('tx.confirm_time')} value={'xx'}/>
          { false && <MetaItem label={intl.get('tx.block')} value={'xx'} render={'xx'}/> }
          { false && <MetaItem label={intl.get('tx.nonce')} value={'xx'}/> }
        </div>
        {
          false &&
          <div className="bg-white mt10">
            <MetaItem label={intl.get('common.sell')} value={'xxx'}/>
            <MetaItem label={intl.get('common.buy')} value={'xxx'}/>
          </div>
        }
      </div>
    </div>
  )
}
export default connect()(TxDetail)
