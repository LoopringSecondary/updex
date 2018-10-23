import React from 'react';
import { connect } from 'dva';
import { Button,NavBar } from 'antd-mobile';
import { Icon } from 'antd';

const HelperOfFAQ = (props)=>{
  const {dispatch} = props
  return (
    <div className="fs20">
      <div className="zb-b-b p10">
        <div className="fs14 color-black-2 mb5">TODO</div>
      </div>
    </div>
  )
}
export default connect()(HelperOfFAQ)





