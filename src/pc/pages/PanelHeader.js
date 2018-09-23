import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {title} = this.props
    return (
      <div className="row no-gutters ml0 mr0 bg-white" style={{height:'auto'}}>
        <div className="col-auo d-flex align-items-center fs16 pl15 color-black-1 pt10 pb10" style={{height:'auto'}}>
          {title}
        </div>
        <div className="col" style={{height:'auto'}}>
        </div>
      </div>
    )
  }
}

export default Header
