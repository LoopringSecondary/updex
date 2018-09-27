import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {title,style={},className=''} = this.props
    return (
      <div className="bg-white">
        <div className={`row no-gutters ml0 mr0  ${className}`} style={{height:'auto',...style}}>
          <div className="col-auo d-flex align-items-center fs16 text-primary pt10 pb10 pl15 pr15" style={{height:'auto'}}>
            {title}
          </div>
          <div className="col" style={{height:'auto'}}>
          </div>
        </div>
        <div className="divider 1px zb-b-t-bak"></div>
      </div>
      
    )
  }
}

export default Header
