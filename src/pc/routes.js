import React from 'react'
import { Redirect, Route, Switch } from 'dva/router'
import Pages from './pages'
import Orders from './orders'
import Tokens from './tokens'
import Account from './account'
import Markets from './tickers/Markets'
import MarketsSearch from './tickers/ListSearchTickers'
import MarketDetail from './tickers/Detail'
import MarketModals from './tickers/Modals'
import AuthModals from './auth/Modals'
import SignModals from './sign/Modals'
import NotificationModals from './notifications/Modals'
import Convert from './tokens/ConvertForm'
import PlaceOrder from './orders/PlaceOrderPage'
import UserCenter from './account/UserCenter'
import ListTodos from './notifications/ListTodos'
import CommonModals from '../components/Modals'
import storage from 'modules/storage'
import UserAgent from 'common/utils/useragent'

const UnLogged = ()=>{
  const isLogged = !!storage.wallet.getUnlockedAddress()
  if(isLogged){
    return <Redirect to="/dex" />
  }else{
    return (
      <Redirect to="/auth" />
    )
  }
}
const Logged = ()=>{
  // const isLogged =  !!storage.wallet.getUnlockedAddress()
  const isLogged = true
  const ua = new UserAgent()
  const isMobile = ua.isMobile()
  if(!isMobile){
    return (
      <div>
        <Switch>
          <Route path={`/trade`} component={Pages.Home4} />
          <Route path={`/trade2`} component={Pages.Home} />
          <Route path={`/trade3`} component={Pages.Home3} />
          <Route path={`/trade4`} component={Pages.Home2} />
          <Redirect from="/" to="/trade" />
        </Switch>
        <CommonModals />
        <SignModals />
        <AuthModals />
        <Orders.Modals />
        <Tokens.Modals />
        <Account.Modals />
        <MarketModals />
        <NotificationModals />

      </div>
    )
  }else{
    return <Redirect to="/dex" />
  }
}

export default class Routes extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Switch>
        <Route path={`/`}  component={Logged} />
      </Switch>
    );
  }
}




