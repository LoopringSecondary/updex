import React from 'react'
import ReactDOM from 'react-dom'
import {Card} from 'antd'
import { NavBar,Icon,PickerView } from 'antd-mobile';
import intl from 'react-intl-universal'
import {connect} from 'dva'
import moment from 'moment'
import storage from 'modules/storage'

class HelperOfMiniFill extends React.Component {
  render() {
    const { placeOrder,dispatch } = this.props
    const {validUntil} = placeOrder
    let defaultTo = moment().add(1, 'months')
    if(validUntil) defaultTo = validUntil

    function timeToLiveValueChange(e) {
      const start = moment()
      const end = moment(e)
      dispatch({type:'placeOrder/validTimeChange', payload:{validSince: start, validUntil: end}})
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
      <div className="bg-white">
        <NavBar
          className="zb-b-b"
          mode="light"
          onLeftClick={() => hideLayer({id:'helperOfMiniFill'})}
          leftContent={[
            <span key='1' className=""><Icon type="cross"/></span>,
          ]}
        >
          Set Mini Fill Of Order
        </NavBar>
        <div className="">
          <PickerView
            mode="datetime"
            data={[]}
            cols={1}
            onChange={()=>{}}
          />
        </div>
      </div>
    );
  }
}
function mapToProps(state) {
  return {
    placeOrder:state.placeOrder,
    settings:state.settings,
  }
}
export default connect(mapToProps)(HelperOfMiniFill)

