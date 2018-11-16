import React from 'react';
import {Icon} from 'antd'
import {Button, NavBar, Toast} from 'antd-mobile'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import moment from "moment/moment";
import {signMessage} from 'common/utils/signUtils'


class Login extends React.Component {

  state ={
    signed:false,
    content:null
  }



  sign = () => {
    const {login:{uuid}} = this.props;
    const timestamp = moment().unix().toString();
    signMessage(timestamp).then(res => {
      if (res.result) {
        this.setState({signed:true,content:{
            sign: {...res.result, owner: window.Wallet.address, timestamp},
            uuid
          }})
      }
    })
  }

  authToLogin = () => {
    const {content} = this.state
    window.RELAY.account.notifyScanLogin(content).then(resp => {
      if (resp.result) {
        this.hideLayer({id:'login'});
        this.showLayer({id:'signResult',type:'login'})
      } else {
        this.showLayer({id:'signResult',error:resp.error})
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
    const {signed} = this.state
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
      <div className="row pt15 pb15 zb-b-b ml0 mr0 no-gutters align-items-center fs14">
        <div className="col text-left">
          <div className="color-black-1">
            {1}.&nbsp;&nbsp; {intl.get('scan.login_title')}
          </div>
        </div>
        <div className="col-auto ">
          {signed &&
          <div className="color-success">
            <Icon className="mr5" type="check-circle" theme="filled"  />{intl.get('sign.signed')}
          </div>
          }
          {!signed &&
          <div className="">
            <Button className="cursor-pointer fs12 h-30 pl15 pr15" type="primary" size="small" onClick={this.sign}>{intl.get('actions.sign')}</Button>
          </div>
          }
        </div>
      </div>
      </div>
      <div className="p15">
        <Button className="d-block mb0" size="" type="primary" onClick={this.authToLogin} disabled={!signed} > {intl.get('actions.submit')} </Button>
      </div>
    </div>
  );
}
}

export default connect()(Login)
