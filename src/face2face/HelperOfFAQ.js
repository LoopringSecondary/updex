import React from 'react';
import { connect } from 'dva';
import { Button,NavBar } from 'antd-mobile';
import { Icon } from 'antd';

const HelperOfFAQ = (props)=>{
  const {dispatch} = props
  return (
    <div className="fs20 bg-white" style={{height:"100%",overflow:'auto' }}>
      <NavBar
        className="zb-b-b"
        mode="light"
        onLeftClick={() => dispatch({type:'layers/hideLayer',payload:{id:'helperOfFAQ'}})}
        leftContent={[
          <span key='1' className="fs14"><Icon type="close"/></span>,
        ]}
      >
        帮助
      </NavBar>
      <div className="zb-b-b p15">
        <div className="fs14 color-black-2 mb5 text-left">什么是 P2P 交易？</div>
        <div className="fs12 color-black-3 lh20 text-left">
          P2P交易 即 个人对个人(Person To Person)交易。<br />
        </div>
      </div>
      <div className="zb-b-b p10">
        <div className="fs14 color-black-2 mb5 text-left">P2P 交易有哪些特点？</div>
        <div className="fs12 color-black-3 lh20 text-left">
          1. 待完成<br />
          2. 待完成<br />
          3. 待完成<br />
        </div>
      </div>
      <div className="zb-b-b p10">
        <div className="fs14 color-black-2 mb5 text-left">P2P 交易适合哪些场景？</div>
        <div className="fs12 color-black-3 lh20 text-left">
          1. 待完成<br />
          2. 待完成<br />
          3. 待完成<br />
        </div>
      </div>
      <div className="zb-b-b p10">
        <div className="fs14 color-black-2 mb5 text-left">P2P 交易常见问题</div>
        <div className="fs12 color-black-3 lh20 text-left">
          1. 待完成<br />
          2. 待完成<br />
          3. 待完成<br />
        </div>
      </div>
    </div>
  )
}
export default connect()(HelperOfFAQ)





