import React from 'react';
import Body2 from './Body2'
import Sidebar from './Sidebar'

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location,dispatch} = this.props;
    return (
      <div className="" style={{height:'100vh',overflow:'none' }}>
        <div className="row no-gutters ml0 mr0">
          <div className="col-auto" style={{height:'100vh'}}>
            <Sidebar location={location} match={match} />
          </div>
          <div className="col" style={{height:'100vh'}}>
            <Body2 location={location} match={match} />
          </div>
        </div>
      </div>
    )
  }
}

export default Home
