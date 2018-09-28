import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {title,style={},className=''} = this.props
    return (
      <div className={`bg-white d-flex flex-column pb10 ${className}`} style={{...style,borderRadius:'0px',margin:'5px'}}>
        {this.props.children}
      </div>
      
    )
  }
}

export default Header
