import React from 'react'
import {connect} from 'dva'
import { NavBar, NoticeBar, Tabs } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import { Link, Redirect, Route, Switch } from 'dva/router'
import Containers from 'modules/containers'
import routeActions from 'common/utils/routeActions'
import storage from 'modules/storage'
import intl from 'react-intl-universal'
import TVChartContainer from './TVChartContainer/index';

class Kline extends React.Component {
  render() {
    return (
      <div className="position-relative" style={{height:'100%'}}>
        <TVChartContainer />
      </div>
    );
  }
}
export default connect()(Kline)





