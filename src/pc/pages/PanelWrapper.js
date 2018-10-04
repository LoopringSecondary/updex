import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {title,style={},className=''} = this.props
    return (
      <div className={`bg-white-light d-flex flex-column pb5 ${className}`} style={{...style,borderRadius:'0px',margin:'0px'}}>
        {this.props.children}
      </div>
      
    )
  }
}

export default Header
