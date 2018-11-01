import React from 'react'
import { connect } from 'dva'
import { NavBar, Slider,List,Radio } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import { toNumber } from 'LoopringJS/common/formatter'
import intl from 'react-intl-universal'
import {setLocale} from "common/utils/localeSetting";

const RadioItem = Radio.RadioItem;

function Settings(props) {
  const {settings,dispatch} = props
  const hideLayer = (payload = {}) => {
    dispatch({
      type: 'layers/hideLayer',
      payload: {
        ...payload
      }
    })
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
          onLeftClick={()=>hideLayer({id:'setLRCFee'})}
          leftContent={[
            <span key='1' className=""><WebIcon type="close"/></span>,
          ]}
          rightContent={[]}
        >
          <div className="color-black">Set Trade Fee</div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
      </div>
      <div style={{overflow:'auto',paddingTop:'4.5rem',paddingBottom:'3rem',height:'100%'}}>
        <div className="bg-white settings pb10">
            <List className="mt10 no-border text-left position-relative" 
              renderHeader={() => <div className="fs14 color-black-3 mb5 mt15 pl15 d-flex justify-content-between">
              <span>{intl.get('settings.trading_fee')}</span>
              <span className="mr15">{settings.trading.lrcFee/10}%</span>
              </div>}
            >
              <List.Item className="pt10 pb10 overflow-visible" >
                <div className="row no-gutters ml0 mr0 fs13 color-black-2 ">
                 <div className="col-auto fs14">{intl.get('setting_lrcfee.slow')}</div>
                 <div className="col text-center">
                  <div className="pt10 pb10 pl15 pr15">
                    <Slider
                      defaultValue={settings.trading.lrcFee}
                      min={1}
                      max={50}
                      onChange={(v)=>lrcFeeChange(v)}
                      onAfterChange={()=>{}}
                    />
                  </div>
                 </div>
                 <div className="col-auto fs14">{intl.get('setting_lrcfee.fast')}</div>
                </div>
              </List.Item>
            </List>
            <div className="fs14 color-black-3 mt5 mb15 pl10 text-left">
              {intl.get('setting_lrcfee.tips')}
            </div>
        </div>
      </div>
      
    </div>
  )
}
export default connect(({settings})=>({settings}))(Settings)



