import React from 'react';
import {Button, Card, Icon, Steps} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import QRCode from 'qrcode.react';
import moment from 'moment'
import CountDown from 'LoopringUI/components/CountDown';
import {keccakHash} from 'LoopringJS/common/utils'
import {getSocketAuthorizationByHash} from 'modules/orders/formatters'
import HelperOfSignOrder from './HelperOfSignOrder'
import HelperOfPlaceOrderResult from './HelperOfPlaceOrderResult'
import storage from 'modules/storage'

const signByLooprStep = (placeOrderSteps, circulrNotify) => {
  const hashItem = getSocketAuthorizationByHash(placeOrderSteps.hash, circulrNotify)
  let step = 0
  if(hashItem) {
    switch (hashItem.status) { //init received accept reject
      case 'received':
        step = 1
        break;
      case 'accept':
        step = 2
        break;
      case 'reject':
        step = 2
        break;
      case 'txFailed':
        step = 2
        break;
    }
  }
  return step
}

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
          <div><QRCode value={placeOrderSteps.qrcode} size={320} level='H'/></div>
          <div><CountDown style={{ fontSize: 20 }} target={targetTime} onEnd={overdue}/></div>
        </div>
      }
    </div>
  )
}

class SignSteps extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      generating: false,
    };
  }

  generateQRCode(placeOrderSteps, dispatch) {
    if (!placeOrderSteps.qrcode && placeOrderSteps.unsign && placeOrderSteps.unsign.length > 0 && !this.state.generating) {
      if(placeOrderSteps.task !== 'sign' && placeOrderSteps.unsign.length > 1) {
        throw new Error('Illegal argument : parameter unsign length could larger than 1 only when task equals sign')
      }
      let origin = {}
      // [approve, approveZero] use sign instead
      switch(placeOrderSteps.task) {
        case 'sign':
          origin = JSON.stringify(placeOrderSteps.unsign)
          break;
        case 'cancelOrder':
          origin = JSON.stringify(placeOrderSteps.unsign[0].data)
          break;
        case 'convert':
          origin = JSON.stringify({tx:placeOrderSteps.unsign[0].data, owner:storage.wallet.getUnlockedAddress()})
          break;
        default:
          throw new Error(`Unsupported task type:${placeOrderSteps.task}`)
      }
      // const origin = placeOrderSteps.task === 'sign' ? JSON.stringify(placeOrderSteps.unsign) : JSON.stringify(placeOrderSteps.unsign[0].data)
      const hash = keccakHash(origin)
      if(this.state.generating) {
        return
      }
      this.setState({generating:true})
      window.RELAY.order.setTempStore(hash, origin).then(res => {
        const signWith = window.WALLET.getUnlockType()
        const qrcode = JSON.stringify({type:placeOrderSteps.task, value: hash})
        const time = moment().valueOf()
        dispatch({type: 'placeOrderSteps/qrcodeGenerated', payload: {signWith, qrcode, hash, time}})
        if (!res.error) {
          window.STORE.dispatch({type: 'layers/showLayer', payload: {id: 'helperOfSignStepPC'}})
        }
        this.setState({generating:false})
      }).catch(e=>{
        this.setState({generating:false})
      })
    }
  }

  check(props) {
    const {placeOrderSteps, dispatch} = props
    if((placeOrderSteps.signWith === 'loopr' || placeOrderSteps.signWith === 'upWallet') && !placeOrderSteps.qrcode){
      this.generateQRCode(placeOrderSteps, dispatch)
    }
  }

  componentDidMount() {
    this.check(this.props)
  }

  componentWillReceiveProps(newProps){
    this.check(newProps)
  }

  render() {
    const {placeOrderSteps, circulrNotify, dispatch} = this.props
    let step = 0
    switch(placeOrderSteps.signWith) {
      case 'loopr':
        step = signByLooprStep(placeOrderSteps, circulrNotify)
        break;
      case 'upWallet':
        step = signByLooprStep(placeOrderSteps, circulrNotify)
        break;
      case 'metaMask':
        if(placeOrderSteps.unsign && placeOrderSteps.signed) {
          step = placeOrderSteps.step
        }
        break;
      case 'ledger':
        if(placeOrderSteps.unsign && placeOrderSteps.signed) {
          step = placeOrderSteps.step
        }
        break;
    }

    const steps = [{
      title: intl.get('place_order_by_loopr.step_qrcode'),
      content: 'First-content',
    }, {
      title: intl.get('place_order_by_loopr.step_sign'),
      content: 'Second-content',
    }, {
      title: intl.get('place_order_by_loopr.step_result'),
      content: 'Last-content',
    }];
    return (
      <Card className="rs" title={<div className="pl10 ">{intl.get('place_order_by_loopr.title')}</div>}>
        <div className="p15">
          <div className="mb20 mt15">
            <Steps current={step}>
              {steps.map(item => <Steps.Step key={item.title} title={item.title} />)}
            </Steps>
          </div>
          {
            step === 0 &&
            <div className="mt15">
              <div className="zb-b">
                <div className="text-center p15">
                  {
                    (placeOrderSteps.signWith === 'loopr' || placeOrderSteps.signWith === 'upWallet') &&
                    <SignByLoopr placeOrderSteps={placeOrderSteps} dispatch={dispatch}/>
                  }
                  <div className="pt10 pb10 color-black-2 text-left fs12 " style={{width:'320px',margin:'0 auto'}}>
                    1. {intl.get('place_order_by_loopr.instruction_download')}
                    <br />
                    2. {intl.get('place_order_by_loopr.instruction_scan')}
                    <br />
                    {intl.get('place_order_by_loopr.instruction_warn')}
                  </div>
                </div>
              </div>
            </div>
          }
          {
            step === 1 &&
            <div className="mt15">
              <div className="zb-b">
                {
                  (placeOrderSteps.signWith === 'loopr' || placeOrderSteps.signWith === 'upWallet') &&
                  <div className="text-center p35">
                    <Icon type="clock-circle" className="fs36 text-warning" />
                    <div className="mt15">{intl.get('place_order_by_loopr.waiting_sign')}</div>
                  </div>
                }
                {
                  (placeOrderSteps.signWith === 'metaMask' || placeOrderSteps.signWith === 'ledger') &&
                  <div className="text-center p35">
                    <HelperOfSignOrder />
                  </div>
                }
              </div>
            </div>
          }
          {
            step === 2 &&
            <div className="mt15">
              <HelperOfPlaceOrderResult />
            </div>
          }
        </div>
      </Card>
    )
  }

}

function mapToProps (state) {
  return {
    placeOrderSteps: state.placeOrderSteps,
    circulrNotify:state.sockets.circulrNotify
  }
}

export default connect(mapToProps)(SignSteps)
