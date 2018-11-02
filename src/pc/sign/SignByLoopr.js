import React from 'react';
import intl from 'react-intl-universal'
import QRCode from 'qrcode.react';
import moment from 'moment'
import CountDown from 'LoopringUI/components/CountDown';
import storage from 'modules/storage'

const SignByLoopr = ({placeOrderSteps, dispatch}) => {
  let targetTime = moment().valueOf();
  if(placeOrderSteps.generateTime) {
    targetTime = placeOrderSteps.generateTime + 86400000;
  } else {
    targetTime = moment().valueOf() + 86400000;
  }
  const overdue = () => {
    dispatch({type:'placeOrderByLoopr/overdueChange', payload:{overdue:true}})
  };
  return (
    <div className="">
      <div className="p25 bg-white-light">
        {
          placeOrderSteps.overdue &&
          <div className="fs12 color-black-1">{intl.get('place_order_by_loopr.qrcode_overdue')}</div>
        }
        {
          !placeOrderSteps.overdue && placeOrderSteps.qrcode &&
          <div className="text-center">
            <div className="p5 d-inline-block pb0" style={{background:'#fff',minHeight:'210px'}}>
              <QRCode value={placeOrderSteps.qrcode} size={210} level='H'/>
            </div>
          </div>
        }
      </div>
      <div className="p15 mt5 bg-white-light lh25">
        <div className="pt10 pb10 text-left fs13 color-black-1" style={{margin:'0 auto'}}>
          1. {placeOrderSteps.signWith === 'loopr' ? intl.get('place_order_by_loopr.instruction_download') : intl.get('place_order_by_upwallet.instruction_download')}
          <br />
          2. {placeOrderSteps.signWith === 'loopr' ? intl.get('place_order_by_loopr.instruction_scan') : intl.get('place_order_by_upwallet.instruction_scan')}
          <br />
          3. {placeOrderSteps.signWith === 'loopr' ? intl.get('place_order_by_loopr.instruction_warn') : intl.get('place_order_by_upwallet.instruction_warn')} 
          <span className="color-black-1 ml10">(<CountDown style={{ fontSize: '1.2rem' }} target={targetTime} onEnd={overdue}/>)</span>
        </div>
      </div>
    </div>
  )
}

export default SignByLoopr
