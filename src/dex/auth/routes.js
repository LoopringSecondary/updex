import React from 'react'
import {Link, Redirect, Route, Switch} from 'dva/router'
import AuthByLoopr from './loopr/AuthByLoopr'
import AuthByImtoken from './imtoken/AuthByImtoken'
import AuthByMock from './mock/AuthByMock'
import AuthByTPWallet from './tpwallet/AuthByTPWallet'
import Auth from './Auth.js'
import storage from 'modules/storage'

import Privacy from './terms/Privacy'
import Terms from './terms/Terms'



const UnLogged = (props)=>{
    return (
      <Switch>
         <Route path={`/auth`} exact component={Auth} />
         <Route path={`/auth/terms`} exact component={Terms} />
         <Route path={`/auth/privacy`} exact component={Privacy} />
       </Switch>
    )
}

export default class Routes extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Switch>
        <Route path={`/auth`}  component={UnLogged} />
      </Switch>
    );
  }
}




