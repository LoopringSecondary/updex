import React from 'react'
import { connect } from 'dva'
import { NavBar, Slider,List,Radio } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import { toNumber } from 'LoopringJS/common/formatter'
import intl from 'react-intl-universal'
import {setLocale} from "common/utils/localeSetting";

const RadioItem = Radio.RadioItem;

function SetForm(props) {
  const {settings,dispatch} = props
  const hideLayer = (payload = {}) => {
    dispatch({
      type: 'layers/hideLayer',
      payload: {
        ...payload
      }
    })
  }
  const languages = [
    { value: 'en-US', label: 'English',checked: settings.preference.language === 'en-US'},
    { value: 'zh-CN', label: '中文',checked: settings.preference.language === 'zh-CN'},
  ];

  const languageChange = (language)=>{
    if(language) {
      settings.preference.language = language
      dispatch({
        type: 'settings/preferenceChange',
        payload: settings
      })
      setLocale(language);
    }
  }
  return (
    <div className="bg-white position-relative" style={{height:'100%'}}>
      <div className="position-absolute w-100" style={{zIndex:'1000'}}>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={()=>hideLayer({id:'setLanguage'})}
          leftContent={[
            <span key='1' className=""><WebIcon type="close"/></span>,
          ]}
          rightContent={[]}
        >
          <div className="color-black">{intl.get('settings.language')}</div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
      </div>
      <div style={{overflow:'auto',paddingTop:'4.5rem',paddingBottom:'3rem',height:'100%'}}>
        <div className="bg-white settings pb10">
            <List className="mt10 no-border text-left">
              {languages.map(i => (
                <RadioItem className="zb-b-b" key={i.value} checked={i.checked} onChange={() => languageChange(i.value)}>
                  {i.label}
                </RadioItem>
              ))}
            </List>
        </div>
      </div>
      
    </div>
  )
}
export default connect(({settings})=>({settings}))(SetForm)



