import React from 'react'
import { Link, Redirect, Route, Switch } from 'dva/router'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import { TabBar, NavBar, Icon } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import { connect } from 'dva'
import {toBig,toNumber} from 'LoopringJS/common/formatter'
import TokenFormatter, { getBalanceBySymbol } from '../modules/tokens/TokenFm'

class DexHomeLayout extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div style={{}}>
        {this.props.children}
      </div>
    )
  }
}

export default DexHomeLayout


