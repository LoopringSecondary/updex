import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {title,style={},className=''} = this.props
    return (
      <div className={`bg-white-light d-flex flex-column ${className}`} style={{...style,borderRadius:'0rem',border:'0px solid rgba(255,255,255,0.2)'}}>
        {this.props.children}
      </div>
      
    )
  }
}

export default Header
