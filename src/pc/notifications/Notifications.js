import React from 'react'
import { NavBar, NoticeBar, Tabs } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import { Link, Redirect, Route, Switch } from 'dva/router'
import routeActions from 'common/utils/routeActions'
import ListTodos from './ListTodos'
import storage from 'modules/storage'
import intl from 'react-intl-universal'

class Notifications extends React.Component {
  render() {
    const {match,location} = this.props;
    return (
        <div className="bg-white" style={{height:'100%'}}>
          <NavBar
            className="bg-white"
            mode="light"
            leftContent={null && [
              <span className="" key="1"><WebIcon type="home" /></span>,
            ]}
            rightContent={null && [
              <span className="" key="1" onClick={()=>window.Toast.info('Coming Soon', 1, null, false)}><i className="icon-cog-o"></i></span>
            ]}
          >
            <div className="color-black">{intl.get('todo_list.todo_list_title')}</div>
          </NavBar>
          <div className="divider 1px zb-b-t"></div>
          <ListTodos />
          <div className="pb50"></div>
        </div>
    );
  }
}
export default Notifications





