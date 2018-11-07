import React from 'react'
import { connect } from 'dva'
import { NavBar, Slider,List,Radio } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import { toNumber } from 'LoopringJS/common/formatter'
import intl from 'react-intl-universal'
import {setLocale} from "common/utils/localeSetting";

const RadioItem = Radio.RadioItem;

function Settings(props) {
  const {gas,settings,dispatch} = props
  const hideLayer = (payload = {}) => {
    dispatch({
      type: 'layers/hideLayer',
      payload: {
        ...payload
      }
    })
  }
  const currencys = [
    { value: 'USD', label: 'USD',checked: settings.preference.currency === 'USD'},
    { value: 'CNY', label: 'CNY',checked: settings.preference.currency === 'CNY' },
  ];
  const currencyChange = (currency) => {
    if(currency) {
      settings.preference.currency = currency
      dispatch({
        type: 'settings/preferenceChange',
        payload: settings
      })
      dispatch({
        type:'sockets/filtersChange',
        payload:{
          id:'marketcap',
          currency
        }
      })
      hideLayer({id:'setCurrency'})
    }
  }
  return (
    <div className="bg-white position-relative" style={{height:'100%'}}>
      <div className="position-absolute w-100" style={{zIndex:'1000'}}>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={()=>hideLayer({id:'setCurrency'})}
          leftContent={[
            <span key='1' className=""><WebIcon type="close"/></span>,
          ]}
          rightContent={[]}
        >
          <div className="color-black">{intl.get('settings.currency')}</div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
      </div>
      <div className="pt45 pb30" style={{overflow:'auto',height:'100%'}}>
        <div className="bg-white settings pb10">
            <List className="no-border text-left">
              {currencys.map(i => (
                <RadioItem className="zb-b-b" key={i.value} checked={i.checked} onChange={() => currencyChange(i.value)}>
                  {i.label}
                </RadioItem>
              ))}
            </List>
        </div>
      </div>

    </div>
  )
}
export default connect(({settings})=>({settings}))(Settings)



