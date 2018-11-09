import React from 'react'
import {unlockWithMetaMask} from 'common/utils/unlock'
import { connect } from 'dva'
import storage from 'modules/storage'
import uuidv4 from 'uuid/v4'
import intl from 'react-intl-universal'
import QRCode from 'qrcode.react';
import CountDown from 'LoopringUI/components/CountDown';
import moment from 'moment'
import Notification from 'LoopringUI/components/Notification'
import {Icon} from "antd";
import {NavBar,Button} from "antd-mobile";

const dpath = "m/44'/60'/0'";

class Auth extends React.Component {
  state={
    address:'',
  }
  componentDidMount() {
  }

  showLayer = (payload = {}) => {
    const {dispatch} = this.props
    dispatch({
      type: 'layers/showLayer',
      payload: {
        ...payload
      }
    })
  }

  hideLayer = (payload = {}) => {
    const {dispatch} = this.props
    dispatch({
      type:"layers/hideLayer",
      payload:{
        ...payload
      }
    })
  }

  render () {
    const {scanAddress, dispatch} = this.props
    let targetTime = moment().valueOf() + 600000;

    const countDownOnEnd = () => {
      const uuid = uuidv4();
      dispatch({type:'scanAddress/uuidChanged', payload:{UUID:uuid.substring(0, 8)}});
      dispatch({type:'sockets/extraChange',payload:{id:'addressUnlock', extra:{UUID:uuid.substring(0, 8)}}});
      dispatch({type:'sockets/fetch',payload:{id:'addressUnlock'}});
      targetTime = moment().valueOf() + 600000;
    }

    const unlockWith = storage.wallet.getLoopringUnlockWith()

    const _this = this
    return (
      <div className="bg-white" style={{height:'100vh',overflow:'auto'}}>
        <NavBar
          className="bg-white"
          mode="light"
          leftContent={[
            <span onClick={()=>_this.hideLayer({id:'unlockByLoopr'})} className="text-primary fs14 cursor-pointer" key="1"><Icon type="close" /></span>,
          ]}
          rightContent={[]}
        >
          <div className="color-black-1 fs16">
            {unlockWith === 'loopr' ? intl.get('unlock_by_loopr.title') : intl.get('unlock_by_upwallet.title')}
          </div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
        <div className="p15 pt50">
          {
            !scanAddress.address &&
            <div className="">
            {
              scanAddress && scanAddress.UUID &&
              <div className="pt10 pb10 text-center fs12 color-black-1" style={{margin:'0 auto'}}>
                <div className="p15 " >
                	<span className="p10 d-inline-block" style={{background:'#fff'}}>
                		<QRCode value={JSON.stringify({type:'UUID', value:scanAddress.UUID})} size={220} level='H'/>
                		<div className="mt5 lh10">
                			<CountDown style={{ fontSize: '1rem',color:"rgba(0,0,0,0.7)" }} className="" target={targetTime} onEnd={countDownOnEnd}/>
                		</div>
                	</span>
                </div>
                <Button type="primary" size="small" className="mt10 border-none bg-primary-light text-primary fs12 d-block" onClick={() => window.open('https://upwallet.io')}>
                  <Icon type="apple" className="mr5 fs14" theme="filled" />
                  {intl.get('unlock_by_upwallet.ios_only')}
                </Button>
                <div className="bg-white-light p15 text-left lh25 mt15 fs12">
                  1. {unlockWith === 'loopr' ? intl.get('unlock_by_loopr.instruction_download') : intl.get('unlock_by_upwallet.instruction_download')}
                  <a href="https://upwallet.io" target='_blank' className="text-primary ml5">{intl.get('actions.download')}</a>
                  <br />
                  2. {unlockWith === 'loopr' ? intl.get('unlock_by_loopr.instruction_scan') : intl.get('unlock_by_upwallet.instruction_scan')}
                  <br />
                  3. {unlockWith === 'loopr' ? intl.get('unlock_by_loopr.instruction_warn') : intl.get('unlock_by_upwallet.instruction_warn')}
                </div>
              </div>
            }
            </div>
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    scanAddress:state.scanAddress,
  }
}

export default connect(mapStateToProps)(Auth)
