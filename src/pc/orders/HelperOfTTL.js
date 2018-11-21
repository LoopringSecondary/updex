import React from 'react'
import ReactDOM from 'react-dom'
import {Card} from 'antd'
import { DatePickerView, NavBar,Icon } from 'antd-mobile';
import intl from 'react-intl-universal'
import {connect} from 'dva'
import moment from 'moment'
import storage from 'modules/storage'

class TTLForm extends React.Component {
  render() {
    const { ttl,dispatch } = this.props
    const {validUntil} = ttl
    let defaultTo = moment().add(1, 'months')
    if(validUntil) defaultTo = validUntil

    function timeToLiveValueChange(e) {
      const end = moment(e)
      dispatch({type:'ttl/validTimeChange', payload:{validUntil: end}})
    }

    const hideLayer = (payload = {}) => {
      dispatch({
        type: 'layers/hideLayer',
        payload: {
          ...payload
        }
      })
    }

    return (
      <div className="bg-white" style={{height:'100%'}}>
        <NavBar
          className="zb-b-b"
          mode="light"
          onLeftClick={() => hideLayer({id:'helperOfTTL'})}
          leftContent={[
            <span key='1' className=""><Icon type="cross"/></span>,
          ]}
        >
          <div className="color-black-1">{intl.get('setting_ttl.title')}</div>
        </NavBar>
        <div className="zb-b-b">
          <DatePickerView
            mode="datetime"
            minDate={moment().toDate()}
            value={defaultTo.toDate()}
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
    ttl:state.ttl,
    settings:state.settings,
  }
}
export default connect(mapToProps)(TTLForm)

