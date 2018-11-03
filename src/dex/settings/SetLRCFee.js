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
          <div className="color-black">{intl.get('settings.trading_fee')}</div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
      </div>
      <div className="pt45 pb30" style={{overflow:'auto',height:'100%'}}>
        <div className="bg-white settings pb10">
            <List className="mt10 no-border text-left position-relative" >
              <List.Item className="overflow-visible pt15 pb15" style={{height:'auto'}}>
                <div className="ml25 mr25">
                  <Slider
                    defaultValue={settings.trading.lrcFee}
                    min={1}
                    max={50}
                    onChange={(v)=>lrcFeeChange(v)}
                    onAfterChange={()=>{}}
                  />
                </div>
              </List.Item>
              <List.Item className="pt5 pb5 overflow-visible" >
                <div className="row no-gutters ml25 mr25 color-black-2 fs13">
                 <div className="col-auto">{intl.get('setting_lrcfee.slow')}</div>
                 <div className="col text-center">
                  {settings.trading.lrcFee/10}%
                 </div>
                 <div className="col-auto">{intl.get('setting_lrcfee.fast')}</div>
                </div>
              </List.Item>
            </List>
            <div className="fs12 color-black-3 mt10 mb15 pl10 text-left">
              {intl.get('setting_lrcfee.tips')}
            </div>
        </div>
      </div>
      
    </div>
  )
}
export default connect(({settings})=>({settings}))(Settings)



