import React from 'react';
import {Icon, Alert} from 'antd'
import {Button, NavBar, Toast, Result, Modal} from 'antd-mobile'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'
import routeActions from 'common/utils/routeActions'

class SignResult extends React.Component {

  render() {
    const {dispatch, signResult} = this.props
    const {type, error} = signResult
    const hideLayer = (payload = {}) => {
      dispatch({
        type: 'layers/hideLayer',
        payload: {
          ...payload
        }
      })
    }

    const getTitle = () => {
      switch (type){
        case 'order':
          return intl.get('scan.result.place_order_suc')
        case 'convert':
          return intl.get('scan.result.convert_suc')
        case 'cancel_order':
          return intl.get('scan.result.cancel_order_suc')
        case 'approve':
          return intl.get('scan.result.approve_suc')
        case 'login':
          return intl.get('scan.result.login_suc')
      }

    }


    return (
      <div className="bg-fill" style={{maxHeight: '100%', overflow: 'auto'}}>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={() => hideLayer({id: 'signResult'})}
          leftContent={[
            <span className="text-primary circle-30 bg-primary-light center-center fs14"><Icon key="1"
                                                                                               type="close"/></span>,
          ]}
          rightContent={[]}
        >
          Result
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
        {!error && <div className="bg-white p15" style={{}}>
          <Result
            img={<Icon className="color-success fs50 center-center color-white" type="check-circle" theme="filled"/>}
            title={<div className="fs20">{getTitle()}</div>}
            message={<div className="fs12">{intl.get('scan.tip.confirm_web')}</div>}
          />
          <div className="pt15 pb15 fs12 color-black3 lh25 text-left">
            <div>1. {intl.get('scan.tip.suc')}</div>
            <div>2. {intl.get('scan.tip.fresh')}</div>
            <div>3. {intl.get('scan.tip.fresh_again')}</div>
          </div>
        </div>}
        {!!error && <div className="bg-white p15" style={{}}>
          <Result
            img={<Icon className="color-error fs50 center-center color-white" type="close-circle" theme="filled"/>}
            title={<div className="fs20">{intl.get('scan.result.fail')}</div>}
            message={<div className="fs12">{error.message}</div>}
          />
          <Button className="w-100 d-block mt15 mb0" size="" type="primary" onClick={() => {
           hideLayer({id: 'signResult'}); routeActions.gotoPath('/dex/scan')}} >{intl.get('scan.tip.again')}</Button>
        </div>}
      </div>
    );
  }

};

function mapToProps(state) {
  return {}
}

export default connect(mapToProps)(SignResult)
