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
  const language = settings.preference.language === 'en-US' ? 'English' : '中文'
  const unit = intl.get(`common.${settings.trading.timeToLiveUnit}`)
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
        <div className="settings pb10">
            <List className="mt10 no-border text-left" renderHeader={() => <div className="fs14 color-black-3 mb5 mt15 pl15">{intl.get('settings.preferences')}</div>}>
              <List.Item onClick={()=>showLayer({id:'setLanguage'})} className="overflow-visible" extra={language} arrow="horizontal" >
                <WebIcon type="global" className="mr10 text-primary fs16" />
                <span className="color-black-1">{intl.get('settings.language')}</span>
              </List.Item>
              <List.Item onClick={()=>showLayer({id:'setCurrency'})} className="overflow-visible" extra={settings.preference.currency} arrow="horizontal" >
                <WebIcon type="pay-circle" className="mr10 text-primary fs16" />
                <span className="color-black-1">{intl.get('settings.currency')}</span>
              </List.Item>
              {
                false &&
                <List.Item onClick={()=>showLayer({id:'setTheme'})} className="overflow-visible" extra={"Grey"} arrow="horizontal" >
                  <WebIcon type="skin" className="mr10 text-primary fs16" />
                  <span className="color-black-1">{intl.get('settings.theme')}</span>
                </List.Item>
              }
              {
                false &&
                <List.Item onClick={()=>showLayer({id:'setLayout'})} className="overflow-visible" extra={"Big Chart"} arrow="horizontal" >
                  <WebIcon type="layout" className="mr10 text-primary fs16" />
                  <span className="color-black-1">{intl.get('settings.layout')}</span>
                </List.Item>
              }
              {
                false &&
                <List.Item className="overflow-visible" extra={"Red- Green+"} arrow="horizontal" >
                  <WebIcon type="rise" className="mr10 text-primary fs16" />
                  <span className="color-black-1">Change Color</span>
                </List.Item>
              }
            </List>
            <List className="mt10 no-border text-left" renderHeader={() => <div className="fs14 color-black-3 mb5 mt15 pl15">{intl.get('settings.market_trade')}</div>}>
              <List.Item onClick={()=>showLayer({id:'setLRCFee'})} className="overflow-visible" extra={`${settings.trading.lrcFee / 10}%`} arrow="horizontal" >
                <WebIcon type="property-safety" className="mr10 text-primary fs16" />
                <span className="color-black-1">{intl.get('settings.trading_fee')}</span>
              </List.Item>
              <List.Item onClick={()=>showLayer({id:'setTTL'})}  className="overflow-visible" extra={`${settings.trading.timeToLive} ${unit}`} arrow="horizontal" >
                <WebIcon type="hourglass" className="mr10 text-primary fs16" />
                <span className="color-black-1">{intl.get('settings.time_to_live')}</span>
              </List.Item>
            </List>
            <List className="mt10 no-border text-left" renderHeader={() => <div className="fs14 color-black-3 mb5 mt15 pl15">{intl.get('common.mode')}</div>}>
              <List.Item onClick={()=>showLayer({id:'setIsDeveloper'})} className="overflow-visible" extra={
                <div>
                  {settings.isDeveloper && intl.get('set_is_developer.opened')}
                  {!settings.isDeveloper && intl.get('set_is_developer.closed')}
                </div>
              } arrow="horizontal" >
                <WebIcon type="experiment" className="mr10 text-primary fs16" />
                <span className="color-black-1">{intl.get('set_is_developer.page_title')}</span>
              </List.Item>
            </List>

        </div>
      </div>
      
    </div>
  )
}
export default connect(({settings})=>({settings}))(Settings)



