import React from 'react'
import { Redirect, Route, Switch } from 'dva/router'
import storage from 'modules/storage'
import Face2FacePage from './Face2FacePage'
import Face2FaceModals from './Modals'
import TokenModals from '../dex/tokens/Modals'
import CommonModals from '../dex/common/Modals'

const Logged = (props)=>{
  const isLogged = true

  if(isLogged){
    return (
      <div>
        <Switch>
          <Route path={`/p2p`} exact component={Face2FacePage} />
        </Switch>
        <Face2FaceModals />
        <TokenModals />
        <CommonModals />
      </div>
    )
  }else{
  }
}

export default class Routes extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {match,location} = this.props;
    // const {url} = match;
    const url = ""
    return (
      <div style={{width:'48rem',margin:'0 auto'}}>
        <Switch>
          <Route path={`/p2p`}  component={Logged} />
        </Switch>
      </div>
    );
  }
}




