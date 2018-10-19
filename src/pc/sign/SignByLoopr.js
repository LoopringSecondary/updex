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
    <div>
      {
        placeOrderSteps.overdue &&
        <div>{intl.get('place_order_by_loopr.qrcode_overdue')}</div>
      }
      {
        !placeOrderSteps.overdue && placeOrderSteps.qrcode &&
        <div>
          <div><QRCode value={placeOrderSteps.qrcode} size={"32rem"} level='H'/></div>
          <div className="color-black-1"><CountDown style={{ fontSize: 20 }} target={targetTime} onEnd={overdue}/></div>
        </div>
      }
      <div className="pt10 pb10 text-left fs12 color-black-1" style={{width:'320px',margin:'0 auto'}}>
        1. {placeOrderSteps.signWith === 'loopr' ? intl.get('place_order_by_loopr.instruction_download') : intl.get('place_order_by_upwallet.instruction_download')}
        <br />
        2. {placeOrderSteps.signWith === 'loopr' ? intl.get('place_order_by_loopr.instruction_scan') : intl.get('place_order_by_upwallet.instruction_scan')}
        <br />
        {placeOrderSteps.signWith === 'loopr' ? intl.get('place_order_by_loopr.instruction_warn') : intl.get('place_order_by_upwallet.instruction_warn')}
      </div>
    </div>
  )
}
