import React from 'react'
import { connect } from 'dva'
import { NavBar, Slider,List,Radio } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import intl from 'react-intl-universal'
import ListMarketTickers from './ListMarketTickers'

function MarketPage(props) {
  const {gas,settings,dispatch} = props
  
  const hideLayer = (payload = {}) => {
    dispatch({
      type: 'layers/hideLayer',
      payload: {
        ...payload
      }
    })
  }

  return (
    <div className="bg-white position-relative" style={{height:'100%'}}>
      <div className="position-absolute w-100" style={{zIndex:'1000'}}>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={()=>hideLayer({id:'ListMarketTickers'})}
          leftContent={null && [
            <span key='1' className=""><WebIcon type="close"/></span>,
          ]}
          rightContent={[
            <span key='1' onClick={()=>hideLayer({id:'ListMarketTickers'})} className=""><WebIcon type="close"/></span>,
          ]}
        >
          <div className="color-black">Markets</div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
      </div>
      <div style={{overflow:'auto',paddingTop:'4.5rem',paddingBottom:'3rem',height:'100%'}}>
        <ListMarketTickers />
      </div>
    </div>
  )
}
export default connect(({settings})=>({settings}))(MarketPage)



