import React from 'react'
import {Icon, NavBar, PickerView,Stepper} from 'antd-mobile';
import {Input} from 'antd'
import {connect} from 'dva'
import intl from 'react-intl-universal'
import { toNumber } from 'LoopringJS/common/formatter'

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

    const countChange = (e) => {
      const { value } = e.target;
      const reg = /^(0|[1-9][0-9]*)(\.[0-9]*)?$/;
      if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        dispatch({type:'p2pOrder/countChange',payload:{count:value}})
      }
    }

    const plus = () => {
      dispatch({type:'p2pOrder/countChange',payload:{count:toNumber(count) +1}})
    }

    const minus = ()=>{
      if(count >= 1){
        dispatch({type:'p2pOrder/countChange',payload:{count:toNumber(count) -1}})
      }
    };
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
        <div className="zb-b-b mt10 p15 pt30 center-center" style={{height:'15rem'}}>
          {/*<Stepper*/}
            {/*showNumber*/}
            {/*className="bg-white-light circle text-primary"*/}
            {/*style={{margin:'0 auto'}}*/}
            {/*min={1}*/}
            {/*defaultValue={1}*/}
            {/*value={count}*/}
            {/*onChange={countChange}*/}
          {/*/>*/}
          <Input
                  value={count} onChange={countChange}
                  addonBefore={<div onClick={minus}><Icon type="minus-square" theme="filled" /></div>}
                  addonAfter={<div onClick={plus}><Icon type="plus-square" theme="filled" /></div>}
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

