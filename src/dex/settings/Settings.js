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
  const languages = [
    { value: 'en-US', label: 'English',checked: settings.preference.language === 'en-US'},
    { value: 'zh-CN', label: '中文',checked: settings.preference.language === 'zh-CN'},
  ];
  const currencys = [
    { value: 'USD', label: 'USD',checked: settings.preference.currency === 'USD'},
    { value: 'CNY', label: 'CNY',checked: settings.preference.currency === 'CNY' },
  ];
  const ttls = [
    { value: 0, label: '1 Month',checked:true},
    { value: 1, label: '1 Week',checked:false },
    { value: 2, label: '1 Day',checked:false },
    { value: 3, label: '1 Hour',checked:false },
    { value: 4, label: 'Custom',checked:false },
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

  const currencyChange = (currency) => {
    if(currency) {
      settings.preference.currency = currency
      dispatch({
        type: 'settings/preferenceChange',
        payload: settings
      })
    }
  }

  const lrcFeeChange = (lrcFeePermillage) => {
    settings.trading.lrcFee = lrcFeePermillage
    dispatch({
      type: 'settings/preferenceChange',
      payload: settings
    })
  }

  return (
    <div className="bg-white position-relative" style={{height:'100%'}}>
      <div className="position-absolute w-100" style={{zIndex:'1000'}}>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={()=>hideLayer({id:'settings'})}
          leftContent={[
            <span key='1' className=""><WebIcon type="close"/></span>,
          ]}
          rightContent={null && [
            <WebIcon key="1" type="question-circle-o"/>,
          ]}
        >
          <div className="color-black">{intl.get('settings.title')}</div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
      </div>
      <div style={{overflow:'auto',paddingTop:'4.5rem',paddingBottom:'3rem',height:'100%'}}>
        <div className="bg-white settings pb10">
            <List className="mt10 no-border text-left" renderHeader={() => <div className="fs14 color-black-3 mb5 mt15 pl15">Preference</div>}>
              <List.Item className="overflow-visible" extra={"English"} arrow="horizontal" >
                <WebIcon type="global" className="mr10 text-primary fs16" />
                <span className="color-black-1">Language</span>
              </List.Item>
              <List.Item className="overflow-visible" extra={"USD"} arrow="horizontal" >
                <WebIcon type="pay-circle" className="mr10 text-primary fs16" />
                <span className="color-black-1">Currency</span>
              </List.Item>
              <List.Item className="overflow-visible" extra={"Grey"} arrow="horizontal" >
                <WebIcon type="skin" className="mr10 text-primary fs16" />
                <span className="color-black-1">Skin</span>
              </List.Item>
              <List.Item className="overflow-visible" extra={"Big Chart"} arrow="horizontal" >
                <WebIcon type="layout" className="mr10 text-primary fs16" />
                <span className="color-black-1">Layout</span>
              </List.Item>
              <List.Item className="overflow-visible" extra={"Red- Green+"} arrow="horizontal" >
                <WebIcon type="rise" className="mr10 text-primary fs16" />
                <span className="color-black-1">Change Color</span>
              </List.Item>
            </List>
            <List className="mt10 no-border text-left" renderHeader={() => <div className="fs14 color-black-3 mb5 mt15 pl15">Market Trade</div>}>
              <List.Item className="overflow-visible" extra={"0.2%"} arrow="horizontal" >
                <WebIcon type="property-safety" className="mr10 text-primary fs16" />
                <span className="color-black-1">Trade Fee</span>
              </List.Item>
              <List.Item className="overflow-visible" extra={"1 Hour"} arrow="horizontal" >
                <WebIcon type="hourglass" className="mr10 text-primary fs16" />
                <span className="color-black-1">Order Time-To-Live</span>
              </List.Item>
            </List>
        </div>
      </div>
      
    </div>
  )
}
export default connect(({settings})=>({settings}))(Settings)



