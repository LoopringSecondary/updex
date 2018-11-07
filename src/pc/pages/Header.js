import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import { Icon as WebIcon } from 'antd';
import TickerItem from '../tickers/TickerItem';
import storage from 'modules/storage'
import UserInfo from '../account/UserInfo'
import NumberOfTodos from 'mobile/notifications/NumberOfTodos'


class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location,dispatch,className} = this.props;
    const showLayer = (id)=>{
      dispatch({
        type:"layers/showLayer",
        payload:{id}
      })
    }
    return (
      <div className={`bg-white row no-gutters d-flex align-items-stretch h-60 ${className}`}>
        <div className="col d-flex align-items-center text-left ">
          <TickerItem />
        </div>
        {
          false &&
          <div onClick={()=>{}} className="cursor-pointer col-auto d-flex align-items-center zb-b-l pl25 pr25">
            <WebIcon type="question-circle" className="fs20 text-primary" />
          </div>
        }
        <div onClick={showLayer.bind(this,'notifications')} className="cursor-pointer hover-default col-auto d-flex align-items-center zb-b-l pl25 pr25">
          <NumberOfTodos> <WebIcon type="bell" className="fs20 text-primary" /></NumberOfTodos>
        </div>
        <div onClick={showLayer.bind(this,'setLayout')} className="cursor-pointer hover-default col-auto d-flex align-items-center zb-b-l pl25 pr25">
          <WebIcon type="layout" className="fs20 text-primary" />
        </div>
        <div onClick={showLayer.bind(this,'setTheme')} className="cursor-pointer hover-default col-auto d-flex align-items-center zb-b-l pl25 pr25">
          <WebIcon type="skin" className="fs20 text-primary" />
        </div>
        <div onClick={showLayer.bind(this,'settings')} className="cursor-pointer hover-default col-auto d-flex align-items-center zb-b-l pl25 pr25">
          <WebIcon type="setting" className="fs20 text-primary" />
        </div>
        <div className="col-auto d-flex align-items-center zb-b-l">
          <UserInfo />
        </div>
      </div>
    )
  }
}

export default connect()(Header)
