import React from 'react';
import {Icon} from 'antd'
import {Button, NavBar, Toast} from 'antd-mobile'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import moment from "moment/moment";
import {signTx, signMessage, signOrder} from 'common/utils/signUtils'


class Login extends React.Component {

  authToLogin = () => {
    const {login:{uuid}} = this.props
    const timestamp = moment().unix().toString();
    signMessage(timestamp).then(res => {
      if (res.result) {
        window.RELAY.account.notifyScanLogin({
          sign: {...res.result, owner: window.Wallet.address, timestamp},
          uuid
        }).then(resp => {
          if (resp.result) {
            this.showLayer({id:'signResult',type:'login'})
          } else {
            this.showLayer({id:'signResult',error:resp.error})
          }
        })
      }
    })
  }

  showLayer = (payload = {}) => {
    this.props.dispatch({
      type: 'layers/showLayer',
      payload: {
        ...payload
      }
    })
  }

   hideLayer = (payload = {}) => {
    this.props.dispatch({
      type: 'layers/hideLayer',
      payload: {
        ...payload
      }
    })
  }

render(){

  return (
    <div className="bg-white">
      <NavBar
        className="bg-white"
        mode="light"
        onLeftClick={() => this.hideLayer({id:'login'})}
        leftContent={[
          <span className="text-primary circle-30 bg-primary-light center-center fs14"><Icon key="1" type="close" /></span>,
        ]}
        rightContent={[]}
      >
        {intl.get('sign.title')}
      </NavBar>
      <div className="divider 1px zb-b-b"></div>
      <div className="p15 zb-b-b" style={{minHeight:'8rem',borderRadius:'0rem'}}>
        {intl.get('scan.login_title')}
      </div>
      <div className="p15">
        <Button className="d-block mb0" size="" type="primary" onClick={this.authToLogin} > {intl.get('actions.submit')} </Button>
      </div>
    </div>
  );
}
}

export default connect()(Login)
