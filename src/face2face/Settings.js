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
  const showLayer = (payload = {}) => {
    dispatch({
      type: 'layers/showLayer',
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
      <div className="pt45 pb30" style={{overflow:'auto',height:'100%'}}>
        <div className="bg-white settings pb10">
            <List className="mt10 no-border text-left" renderHeader={() => <div className="fs14 color-black-3 mb5 mt15 pl15">{intl.get('settings.language')}</div>}>
              {languages.map(i => (
                <RadioItem className="zb-b-b" key={i.value} checked={i.checked} onChange={() => languageChange(i.value)}>
                  {i.label}
                </RadioItem>
              ))}
            </List>
            <List className="mt10 no-border text-left" renderHeader={() => <div className="fs14 color-black-3 mb5 mt15 pl15">{intl.get('settings.currency')}</div>}>
              {currencys.map(i => (
                <RadioItem className="zb-b-b" key={i.value} checked={i.checked} onChange={() => currencyChange(i.value)}>
                  {i.label}
                </RadioItem>
              ))}
            </List>
          {false && <List className="mt10 no-border text-left position-relative"
              renderHeader={() => <div className="fs14 color-black-3 mb5 mt15 pl15">P2P {intl.get('common.trade')}</div>}
            >
              <List.Item onClick={() => showLayer({id:'helperOfGas'})} className="pt10 pb10 overflow-visible"  arrow="horizontal"
                extra={"0.001 ETH"}
              >
                <div className="color-black-1">Gas</div>
              </List.Item>
              <List.Item onClick={() => showLayer({id:'helperOfMiniFill'})} className="pt10 pb10 overflow-visible" arrow="horizontal"
                extra="1份"
              >
                <div className="color-black-1">订单拆分份数</div>
              </List.Item>
            </List>}

        </div>
      </div>
      
    </div>
  )
}
export default connect(({settings})=>({settings}))(Settings)



