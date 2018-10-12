import React from 'react';
import {Link, Redirect, Route, Switch} from 'dva/router'
import {connect} from 'dva'
import Body2 from './Body2'
import Sidebar from './Sidebar'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarCollapsed:false,
    }
  }
  render(){
    const {match,location,dispatch} = this.props;
    const {url} = match;
    const {pathname} = location;
    const toggleSidebar = ()=>{
      this.setState({
        sidebarCollapsed:!this.state.sidebarCollapsed
      })
    }
    return (
      <div className="" style={{height:'100vh',overflow:'none' }}>
        <div className="row no-gutters ml0 mr0">
          <div className="col-auto" style={{height:'100vh'}}>
            <Sidebar collapsed={this.state.sidebarCollapsed} toggleSidebar={toggleSidebar}/>
          </div>
          <div className="col" style={{height:'100vh'}}>
            <Body2 location={location} match={match} collapsed={this.state.sidebarCollapsed} toggleSidebar={toggleSidebar} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Home)
