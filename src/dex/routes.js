import React from 'react'
import { Redirect, Route, Switch } from 'dva/router'
import Pages from './pages'
import Orders from './orders'
import Tokens from './tokens'
import Account from './account'
import Markets from './tickers/Markets'
import MarketsSearch from './tickers/ListSearchTickers'
import MarketDetail from './tickers/Detail'
import Convert from './tokens/ConvertForm'
import PlaceOrder from './orders/PlaceOrderPage'
import UserCenter from './account/UserCenter'
import Notifications from './notifications/Notifications'
import NotificationModals from './notifications/Modals'
import AuthModals from './auth/Modals'
import ListTodos from './notifications/ListTodos'
import CommonModals from './common/Modals'
import storage from 'modules/storage'
import UserAgent from 'common/utils/useragent'

const UnLogged = ()=>{
  const isLogged =  !!(window.Wallet && window.Wallet.address)
  if(isLogged){
    return <Redirect to="/dex" />
  }else{
    return (
      <Redirect to="/auth" />
    )
}
}
const Logged = ()=>{
  const isLogged =  !!storage.wallet.getUnlockedAddress()
  const ua = new UserAgent()
  const isMobile = ua.isMobile() 
  if(isMobile){
    return (
      <div>
        <Switch>
          <Route path={`/dex/markets`} exact component={Markets} />
          <Route path={`/dex/markets/search/:type`} exact component={MarketsSearch} />
          <Route path={`/dex/markets/:market`} component={MarketDetail} />
          <Route path={`/dex/placeOrder`} exact component={PlaceOrder} />
          <Route path={`/dex/placeOrder/:market`} exact component={PlaceOrder} />
          <Route path={`/dex/usercenter`} component={UserCenter} />
          <Route path={`/dex/convert/:token`} component={Convert} />
          <Route path={`/dex/notifications`} component={Notifications} />
          <Route path={`/dex/todos`} exact component={ListTodos} />
          <Route path={`/dex/messages`} exact component={Pages.Todo} />
          <Route path={`/dex/settings`} exact component={Pages.Todo} />
          <Redirect from="/dex" to="/dex/placeOrder" />
        </Switch>
        <CommonModals />
        <Orders.Modals />
        <Tokens.Modals />
        <Account.Modals />
        <NotificationModals />
        <AuthModals />
      </div>
    )
  }else{
    return <Redirect to="/trade" />
  }
}

export default class Routes extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Switch>
        <Route path={`/dex`}  component={Logged} />
      </Switch>
    );
  }
}




