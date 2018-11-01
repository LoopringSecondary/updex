import React from 'react';
import {connect} from 'dva';
import Home1 from './Home1'
import Home2 from './Home2'
import Home3 from './Home3'
import Home4 from './Home4'
import Sidebar from './Sidebar'

class Trade extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location,dispatch,layout} = this.props;
    switch (layout) {
      case "1":
        return <Home1 />
        break;
      case "2":
        return <Home2 />
        break;
      case "3":
        return <Home3 />
        break;
      case "4":
        return <Home4 />
        break;
      default:
        return <Home1 />
        break;
    }
  }
}

export default connect(({settings})=>({
  layout:settings.preference.layout
}))(Trade)
