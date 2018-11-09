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
    { value: true, label: intl.get('set_is_developer.opened'),checked: settings.isDeveloper === true},
    { value: false, label: intl.get('set_is_developer.closed'),checked: settings.isDeveloper === false },
  ];
  const isDeveloperChange = (isDeveloper) => {
    if(isDeveloper) {
      settings.isDeveloper = isDeveloper
      dispatch({
        type: 'settings/settingsChange',
        payload: {
          ...settings
        }
      })
    }
  }
  return (
    <div className="bg-white position-relative" style={{height:'100%'}}>
      <div className="position-absolute w-100" style={{zIndex:'1000'}}>
        <NavBar
          className="bg-white"
          isDeveloper="light"
          onLeftClick={()=>hideLayer({id:'setIsDeveloper'})}
          leftContent={[
            <span key='1' className="text-primary "><WebIcon type="close"/></span>,
          ]}
          rightContent={[]}
        >
          <div className="color-black">{intl.get('set_is_developer.page_title')}</div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
      </div>
      <div className="pt45 pb30" style={{overflow:'auto',height:'100%'}}>
        <div className="bg-white settings pb10">
            <List className="no-border text-left">
              {options.map(i => (
                <RadioItem className="zb-b-b" key={i.value} checked={i.checked} onChange={() => isDeveloperChange(i.value)}>
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



