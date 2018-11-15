import React from 'react'
import {Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import {Button,Modal} from 'antd-mobile'
import {scanQRCode, signMessage, signOrder, signTx} from 'common/utils/signUtils'
import moment from 'moment'
import Notification from 'LoopringUI/components/Notification'

class Entry extends React.Component {
  render() {
    const {dispatch} = this.props;
    return (
      <div className="" >
      </div>
    )
  }
}

export default connect()(Entry)
