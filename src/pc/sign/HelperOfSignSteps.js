import React from 'react';
import {Button, Card, Icon} from 'antd'
import {Steps,NavBar} from 'antd-mobile'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import QRCode from 'qrcode.react';
import moment from 'moment'
import CountDown from 'LoopringUI/components/CountDown';
import {keccakHash} from 'LoopringJS/common/utils'
import {getSocketAuthorizationByHash} from 'modules/orders/formatters'
import SignOrderAndTxs from './SignOrderAndTxs'
import HelperOfPlaceOrderResult from './HelperOfPlaceOrderResult'
import HelperOfPlaceP2POrderResult from './HelperOfPlaceP2POrderResult'
import SignByLoopr from './SignByLoopr'
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
      let type = placeOrderSteps.task
      switch(placeOrderSteps.task) {
        case 'sign':
          origin = JSON.stringify(placeOrderSteps.unsign)
          break;
        case 'signP2P':
          type = 'sign'
          const unsign = new Array()
          placeOrderSteps.unsign.forEach(item => {
            unsign.push({type:item.type, data:item.data})
          })
          origin = JSON.stringify(unsign)
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
        const qrcode = JSON.stringify({type, value: hash})
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
    let step1, step2, step3, title
    switch(placeOrderSteps.signWith) {
      case 'loopr':
        step = signByLooprStep(placeOrderSteps, circulrNotify)
        title = intl.get('place_order_by_loopr.title')
        step1 = intl.get('place_order_by_loopr.step_qrcode')
        step2 = intl.get('place_order_by_loopr.step_sign')
        step3 = intl.get('place_order_by_loopr.step_result')
        break;
      case 'upWallet':
        step = signByLooprStep(placeOrderSteps, circulrNotify)
        title = intl.get('place_order_by_upwallet.title')
        step1 = intl.get('place_order_by_upwallet.step_qrcode')
        step2 = intl.get('place_order_by_upwallet.step_sign')
        step3 = intl.get('place_order_by_upwallet.step_result')
        break;
      case 'metaMask':
        if(placeOrderSteps.unsign && placeOrderSteps.signed) {
          step = placeOrderSteps.step
        }
        title = intl.get('place_order_by_metamask.title')
        step1 = intl.get('place_order_by_metamask.connect')
        step2 = intl.get('place_order_by_metamask.step_sign')
        step3 = intl.get('place_order_by_metamask.step_result')
        break;
      case 'ledger':
        if(placeOrderSteps.unsign && placeOrderSteps.signed) {
          step = placeOrderSteps.step
        }
        title = intl.get('place_order_by_ledger.title')
        step1 = intl.get('place_order_by_ledger.connect')
        step2 = intl.get('place_order_by_ledger.step_sign')
        step3 = intl.get('place_order_by_ledger.step_result')
        break;
    }
    const steps = [{
      title: step1,
    }, {
      title: step2,
    }, {
      title: step3,
    }];

    return (
      <div className="bg-white" style={{height:'100%'}}>
        <NavBar
          className="bg-white"
          mode="light"
          leftContent={[
            <span onClick={()=>dispatch({type:'layers/hideLayer',payload:{id:'helperOfSignStepPC'}})} className="text-primary fs14 cursor-pointer" key="1"><Icon type="close" /></span>,
          ]}
          rightContent={[]}
        >
          <div className="color-black-1 fs16">
            {title}
          </div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
        <div className="p15">
          <div className="mb20 mt20">
            <Steps current={step} direction="horizontal">
              {steps.map((item, index) => <Steps.Step key={index} title={<div className="color-black-1 font-weight-normal fs13 pt5">{item.title}</div>} />)}
            </Steps>
          </div>
          {
            step === 0 &&
            <div className="mt15">
              {
                (placeOrderSteps.signWith === 'loopr' || placeOrderSteps.signWith === 'upWallet') &&
                <SignByLoopr placeOrderSteps={placeOrderSteps} dispatch={dispatch}/>
              }
            </div>
          }
          {
            step === 1 &&
            <div className="mt15">
              <div className="">
                {
                  (placeOrderSteps.signWith === 'loopr' || placeOrderSteps.signWith === 'upWallet') &&
                  <div className="text-center pt40 pb40 pl15 pr15 bg-fill">
                    <Icon type="clock-circle" className="fs36 text-primary" />
                    <div className="mt15 color-black-1">
                      {placeOrderSteps.signWith === 'loopr' ? intl.get('place_order_by_loopr.waiting_sign') : intl.get('place_order_by_upwallet.waiting_sign')}
                    </div>
                  </div>
                }
                {(placeOrderSteps.signWith === 'metaMask' || placeOrderSteps.signWith === 'ledger') && 
                  <SignOrderAndTxs />
                }
              </div>
            </div>
          }
          {
            step === 2 &&
            <div className="mt15">
              {placeOrderSteps.task === 'signP2P' && <HelperOfPlaceP2POrderResult />}
              {placeOrderSteps.task !== 'signP2P' && <HelperOfPlaceOrderResult />}
            </div>
          }
        </div>
      </div>
      
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
