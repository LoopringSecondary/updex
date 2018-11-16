import React from 'react';
import {Icon,Alert} from 'antd'
import {Button, NavBar, Toast,Result} from 'antd-mobile'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'

class SignResult extends React.Component {

  render(){
    const {dispatch} = this.props
    const hideLayer = (payload = {}) => {
      dispatch({
        type: 'layers/hideLayer',
        payload: {
          ...payload
        }
      })
    }
    
    return (
      <div className="bg-fill">
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={() => hideLayer({id:'signResult'})}
          leftContent={[
            <span className="text-primary"><Icon key="1" type="close" /></span>,
          ]}
          rightContent={[]}
        >
          Result
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
        <div className="bg-white p15" style={{}}>
          <Result
            img={<Icon className="color-success fs50 center-center color-white" type="check-circle" theme="filled" />}
            title={<div className="fs24">登录签名成功</div>}
            message={<div className="fs13">请确认PC端是否已经登录</div>}
          />
          <Button className="w-100 d-block mt15 mb0 fs14" size="" type="primary" onClick={()=>{}}><Icon className="mr5" type="desktop" />已登录</Button>
          <Button className="w-100 d-block mt15 mb0 fs14" size="" type="default" onClick={()=>{}}><Icon className="mr5" type="desktop" />未登录</Button>
        </div>
        <div className="bg-white p15" style={{}}>
          <Result
            img={<Icon className="color-success fs50 center-center color-white" type="check-circle" theme="filled" />}
            title={<div className="fs24">下单签名成功</div>}
            message={<div className="fs13">请确认PC是否已更新</div>}
          />
          <Button className="w-100 d-block mt15 mb0 fs14" size="" type="primary" onClick={()=>{}}><Icon className="mr5" type="desktop" />已更新</Button>
          <Button className="w-100 d-block mt15 mb0 fs14" size="" type="default" onClick={()=>{}}><Icon className="mr5" type="desktop" />未微耕</Button>
        </div>
        <div className="bg-white p15" style={{}}>
          <Result
            img={<Icon className="color-success fs50 center-center color-white" type="check-circle" theme="filled" />}
            title={<div className="fs24">取消订单签名成功</div>}
            message={<div className="fs13">请确认PC是否已更新</div>}
          />
          <Button className="w-100 d-block mt15 mb0 fs14" size="" type="primary" onClick={()=>{}}><Icon className="mr5" type="desktop" />已更新</Button>
          <Button className="w-100 d-block mt15 mb0 fs14" size="" type="default" onClick={()=>{}}><Icon className="mr5" type="desktop" />未更新</Button>
        </div>
        <div className="bg-white p15" style={{}}>
          <Result
            img={<Icon className="color-error fs50 center-center color-white" type="close-circle" theme="filled" />}
            title={<div className="fs24">操作失败</div>}
            message={<div className="fs14">操作失败</div>}
          />
          <Button className="w-100 d-block mt15 mb0" size="" type="primary" onClick={()=>{}} disabled={false}>{intl.get('actions.submit')} </Button>
        </div>
      </div>
    );
  }

};

function mapToProps(state) {
  return {
  }
}
export default connect(mapToProps)(SignResult)
