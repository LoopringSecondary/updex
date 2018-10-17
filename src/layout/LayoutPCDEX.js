import React from 'react'
import { Link, Redirect, Route, Switch } from 'dva/router'
import intl from 'react-intl-universal'
import { connect } from 'dva'

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


