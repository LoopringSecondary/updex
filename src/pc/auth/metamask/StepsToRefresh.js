import React from 'react'
import { Button, NavBar, Modal,List,InputItem,Toast } from 'antd-mobile'
import { connect } from 'dva'
import { Icon, Collapse, Steps, Modal as AntdModal } from 'antd'
import storage from 'modules/storage'
import intl from 'react-intl-universal'

const dpath = "m/44'/60'/0'";

class StepsToRefresh extends React.Component {
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
    const {dispatch} = this.props
    const {address} = this.state;

    const _this = this
    const refresh = () => {
      if (window.web3 && window.web3.eth.accounts[0]) {
        this.connectToMetamask()
      } else {
        window.location.reload()
      }
    }
    return (
      <div className="bg-white" style={{height:'100vh',overflow:'auto'}}>
        <NavBar
          className="bg-white"
          mode="light"
          leftContent={[
            <span onClick={()=>_this.hideLayer({id:'unlockByAddress'})} className="text-primary fs14 cursor-pointer" key="1"><Icon type="close" /></span>,
          ]}
          rightContent={[]}
        >
          <div className="color-black-1 fs16">
            {intl.get('unlock_by_address.title')}
          </div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
        <div className="p15 pt50">
          <Steps direction="vertical">
            {this.state.metamaskState === 'notInstalled' && <Steps.Step status="process" title={intl.get('wallet_meta.unlock_step_install_title')} description={intl.get('wallet_meta.unlock_step_install_content')} />}
            <Steps.Step status="process" title={intl.get('wallet_meta.unlock_step_unlock_title')} description={intl.get('wallet_meta.unlock_step_unlock_content')} />
            <Steps.Step status="process" title={intl.get('wallet_meta.unlock_step_refresh_title')}
                        description={
                          <div>
                            <div>{intl.get('wallet_meta.unlock_step_refresh_content')}</div>
                            <Button onClick={() => refresh()} type="primary" className="mt5" loading={false}>{intl.get('wallet_meta.unlock_refresh_button')}</Button>
                          </div>
                        }
            />
          </Steps>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
  }
}
export default connect(mapStateToProps)(StepsToRefresh)
