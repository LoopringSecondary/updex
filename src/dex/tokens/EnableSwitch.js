import React from 'react'
import { connect } from 'dva'
import { TickerFm, TickersFm } from 'modules/tickers/formatters'
import routeActions from 'common/utils/routeActions'
import { Button, ListView, NavBar, SegmentedControl, Tabs } from 'antd-mobile'
import { Icon as WebIcon,Switch } from 'antd'

class EnableSwitch extends React.Component {
  render(){
    const { symbol,size="small" } = this.props
    return (
      <Switch size={size} loading={false} checked={false} />
    )
  }
}
export default connect()(EnableSwitch)

