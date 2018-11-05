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
    { value: 'darkgrey', label: intl.get('set_theme.dark_grey'),checked: settings.preference.theme === 'darkgrey'},
    { value: 'white', label: intl.get('set_theme.white'),checked: settings.preference.theme === 'white' },
    { value: 'purple', label: intl.get('set_theme.purple'),checked: settings.preference.theme === 'purple' },
    { value: 'blue', label: intl.get('set_theme.blue'),checked: settings.preference.theme === 'blue' },
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
          <div className="color-black">{intl.get('settings.theme')}</div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
      </div>
      <div className="pt45 pb30" style={{overflow:'auto',height:'100%'}}>
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



