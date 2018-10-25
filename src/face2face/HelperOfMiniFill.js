import React from 'react'
import {Icon, NavBar, PickerView} from 'antd-mobile';
import {connect} from 'dva'
import intl from 'react-intl-universal'

class HelperOfMiniFill extends React.Component {
  render() {
    const {dispatch,count } = this.props

    const hideLayer = (payload = {}) => {
      dispatch({
        type: 'layers/hideLayer',
        payload: {
          ...payload
        }
      })
    }

    const countChange = (value) => {
      dispatch({type:'p2pOrder/countChange',payload:{count:value[0]}})
    }

    const data = Array.from(Array(50), (v,k) =>{return {label:k+1,value:k+1}});
    return (
      <div className="bg-white" style={{height:'100%'}}>
        <NavBar
          className="zb-b-b"
          mode="light"
          onLeftClick={() => hideLayer({id:'helperOfMiniFill'})}
          leftContent={[
            <span key='1' className=""><Icon type="cross"/></span>,
          ]}
        >
          <div className="color-black-1">{intl.get('p2p_order.set_count')}</div>
        </NavBar>
        <div className="zb-b-b mt10">
          <PickerView
            data={data}
            value={[count]}
            cascade={false}
            onChange={countChange}
          />
        </div>
      </div>
    );
  }
}

function mapStatetoProps(state) {

  return{
    count:state.p2pOrder.count
  }
}

export default connect(mapStatetoProps)(HelperOfMiniFill)

