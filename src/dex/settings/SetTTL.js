import React from 'react'
import ReactDOM from 'react-dom'
import {Card} from 'antd'
import { PickerView, NavBar,Icon } from 'antd-mobile';
import intl from 'react-intl-universal'
import {connect} from 'dva'
import moment from 'moment'
import storage from 'modules/storage'

class TTLForm extends React.Component {
  render() {
    const { settings, dispatch } = this.props

    function timeToLiveValueChange(e) {
      const data = e[0].split('-')
      settings.trading.timeToLive = data[0]
      settings.trading.timeToLiveUnit = data[1]
      dispatch({
        type: 'settings/preferenceChange',
        payload: settings
      })
    }
    const hideLayer = (payload = {}) => {
      dispatch({
        type: 'layers/hideLayer',
        payload: {
          ...payload
        }
      })
    }
    const options = [
      {label:`1${intl.get('common.hour')}`,value:'1-hour'},
      {label:`1${intl.get('common.day')}`,value:'1-day'},
      {label:`1${intl.get('common.week')}`,value:'1-week'},
      {label:`1${intl.get('common.month')}`,value:'1-month'},
    ]
    return (
      <div className="bg-white" style={{height:'100%'}}>
        <NavBar
          className="zb-b-b"
          mode="light"
          onLeftClick={() => hideLayer({id:'setTTL'})}
          leftContent={[
            <span key='1' className=""><Icon type="cross"/></span>,
          ]}
        >
          <div className="color-black-1">{intl.get('setting_ttl.title')}</div>
        </NavBar>
        <div className="zb-b-b">
          <PickerView
            data={options}
            value={[`${settings.trading.timeToLive}-${settings.trading.timeToLiveUnit}`]}
            cols={1}
            locale={storage.settings.get().preference.language}
            onChange={timeToLiveValueChange}
          />
        </div>
      </div>
    );
  }
}
function mapToProps(state) {
  return {
    settings:state.settings,
  }
}
export default connect(mapToProps)(TTLForm)

