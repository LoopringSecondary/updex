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
  const options = [
    { value: 'darkgrey', label: 'Dark Grey',checked: settings.preference.theme === 'darkgrey'},
    { value: 'white', label: 'White',checked: settings.preference.theme === 'white' },
    { value: 'purple', label: 'Purple',checked: settings.preference.theme === 'purple' },
    // { value: 'blue', label: 'Blue',checked: settings.preference.theme === 'blue' },
  ];
  const themeChange = (theme) => {
    if(theme) {
      settings.preference.theme = theme
      dispatch({
        type: 'settings/preferenceChange',
        payload: settings
      })
    }
  }
  return (
    <div className="bg-white position-relative" style={{height:'100%'}}>
      <div className="position-absolute w-100" style={{zIndex:'1000'}}>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={()=>hideLayer({id:'setTheme'})}
          leftContent={[
            <span key='1' className=""><WebIcon type="close"/></span>,
          ]}
          rightContent={[]}
        >
          <div className="color-black">Set Theme</div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
      </div>
      <div style={{overflow:'auto',paddingTop:'4.5rem',paddingBottom:'3rem',height:'100%'}}>
        <div className="bg-white settings pb10">
            <List className="mt10 no-border text-left">
              {options.map(i => (
                <RadioItem className="zb-b-b" key={i.value} checked={i.checked} onChange={() => themeChange(i.value)}>
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



