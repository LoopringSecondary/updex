import React from 'react'
import { Icon } from 'antd'
import { NavBar } from 'antd-mobile'
import intl from 'react-intl-universal'
import { connect } from 'dva'

function EtherScan(props) {
  const {etherscan,dispatch} = props
  const hideLayer = (payload={})=>{
    dispatch({
      type:'layers/hideLayer',
      payload:{
        ...payload
      }
    })
  }
  return (
    <div className="d-flex-column bg-white" style={{height:"100%"}}>
      <NavBar
        className="bg-white"
        mode="light"
        onLeftClick={()=>hideLayer({id:'etherscan'})}
        leftContent={[
          <span key='1' className=""><Icon type="close"/></span>,
        ]}
        rightContent={null && [
          <Icon key="1" type="question-circle-o"/>,
        ]}
      >
        <div className="color-black">{intl.get('tx_detail.page_title')}</div>
      </NavBar>
      <embed src="https://etherscan.io/address/0xd02323de710729f065a4defbda0c6148c6bac649" />
      <iframe style={{flex:1}} src="https://etherscan.io/address/0xd02323de710729f065a4defbda0c6148c6bac649" className="border-none w-100 h-100"></iframe>
    </div>
  )
}
export default connect()(EtherScan)
