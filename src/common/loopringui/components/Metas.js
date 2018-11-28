import React from 'react';
import {Icon} from 'antd';

export const MetaItem = (props) => {
  const {label, value,render,showArrow=false,onClick=()=>{},className="",style={}} = props
  return (
    <div onClick={onClick} className={`row ml0 mr0 pl0 pr0 zb-b-t no-gutters className`} style={{...style}}>
      <div className="col">
        <div className="color-black-1 lh30 text-left">{label}</div>
      </div>
      <div className="col-auto text-right">
        {value && <div className="color-black-1 text-wrap lh30 text-right">{value}</div> }
        {render && render() }
      </div>
      {
        !!showArrow &&
        <div className="col-auto text-right">
          <div className="fs14 text-primary text-wrap lh30 text-left ml5">
            <Icon type="right" />
          </div>
        </div>
      }
    </div>
  )
}
export const MetaHeader = (props)=>{
  if(props.title){
    return <div className="modal-header text-dark"><h3>{props.title}</h3></div>
  }else{
    return <div className="modal-header text-dark">{props.children}</div>
  }
}

export default {
  MetaItem,
  MetaHeader,
}
