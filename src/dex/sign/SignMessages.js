import React from 'react';
import {Collapse, Form, Icon, Input} from 'antd'
import {Button,NavBar} from 'antd-mobile'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'
import eachLimit from 'async/eachLimit';
import * as uiFormatter from 'modules/formatter/common'
import storage from 'modules/storage'
import { toHex } from 'LoopringJS/common/formatter'

const SignMessages = (props) => {
  const {dispatch} = props
  const unsignMessages = [
    {type:'order',token:'LRC'},
    {type:'cancelOrder',token:'LRC'},
    {type:'approve',token:'LRC'},
    {type:'approveZero',token:'LRC'},
  ]
  const signed = {
    0:false,
    1:false,
    2:false,
  }
  const actualSigned = []
  const handelSubmit = ()=>{}
  const sign = ()=>{}
  const Description = ({tx}) => {
    switch(tx.type) {
      case 'order':
        return intl.get('sign.type_sign_order')
      case 'cancelOrder':
        return intl.get('sign.type_cancel_order')
      case 'approve':
        return intl.get('sign.type_approve', {token:tx.token})
      case 'approveZero':
        return intl.get('sign.type_cancel_allowance', {token:tx.token})
      case 'convert':
        return intl.get('sign.type_convert')
      default:
        return ''
    }

  };
  const MessageItem = ({tx,index})=>{
    return (
      <div className="row pt15 pb15 zb-b-b ml0 mr0 no-gutters align-items-center fs14">
        <div className="col text-left">
          <div className="color-black-1">
            {index+1}.&nbsp;&nbsp;<Description tx={tx}/> hahah
          </div>
        </div>
        <div className="col-auto ">
          {signed[index] &&
          <div className="color-success">
            <Icon className="mr5" type="check-circle" theme="filled"  />{intl.get('place_order_sign.signed')} 
          </div>
          }
          {!signed[index] &&
          <div className="">
            <Button className="cursor-pointer fs12 h-25 lh-25" type="primary" size="small" onClick={sign.bind(this, tx, index)}>签名{intl.get('place_order_sign.unsigned')}</Button>
          </div>
          }
        </div>
      </div>
    )
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
    <div className="bg-fill">
      <NavBar
        className="bg-white"
        mode="light"
        onLeftClick={() => hideLayer({id:'signMessages'})}
        leftContent={[
          <span className="color-black-1"><Icon key="1" type="close" /></span>,
        ]}
        rightContent={[]}
      >
      Sign Messages
      </NavBar>
      <div className="divider 1px zb-b-b"></div>
      <div className="bg-white p15" style={{minHeight:'10rem',borderRadius:'0rem'}}>
        {
          unsignMessages && unsignMessages.map((item, index)=><MessageItem key={index} tx={item} index={index} />)
        }
        <Button className="w-100 d-block mt15 mb0" size="" type="primary" onClick={handelSubmit} disabled={!signed || !unsignMessages || unsignMessages.length !== actualSigned.length}> {intl.get('actions.submit')} </Button>
      </div>
    </div>
  );
};

function mapToProps(state) {
  return {
    p2pOrder: state.p2pOrder,
    wallet:state.wallet
  }
}

export default Form.create()(connect(mapToProps)(SignMessages));