import React from 'react'
import { NavBar, Tabs,Toast } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import { connect } from 'dva'
import routeActions from 'common/utils/routeActions'
import { getTokensByMarket } from 'modules/formatter/common'
import HelperOfOrders from './HelperOfOrders'
import HelperOfBalances from './HelperOfBalances'
import HelperOfMarkets from './HelperOfMarkets'
import Face2FaceForm from './Face2FaceForm'
import intl from 'react-intl-universal'
import {store} from "../index";
import NumberOfTodos from "../dex/notifications/NumberOfTodos";

class Face2FacePage extends React.Component {

  // componentDidMount(){
  //    window.handleP2POrder({result:JSON.stringify({value:{"auth":"27b72006191a23d621fbe2c1491558f5c992e58c5149c070baa7bb7a233a1d98","hash":"0x17192de7258b5ce7423e3ddf27a08cc53f60d87ed412b94299846a4cbe121d1d","count":1}})})
  // }
  render() {
    const {dispatch,placeOrder} = this.props
    const {side,pair} = placeOrder
    const pairTokens = getTokensByMarket(pair)
    const showLayer = (payload={})=>{
      dispatch({
        type:'layers/showLayer',
        payload:{
          ...payload
        }
      })
    }
    const hideLayer = (payload={})=>{
      dispatch({
        type:'layers/hideLayer',
        payload:{
          ...payload
        }
      })
    }
    const sideChange = (side)=>{
      dispatch({
        type:'placeOrder/sideChangeEffects',
        payload:{
          side
        }
      })
   }

   const gotoTrade = ()=>{
      routeActions.gotoPath(`/dex/markets/${pair}`)
    }
    const swap = () => {
      dispatch({type:'p2pOrder/swap'})
    }
    return (
        <div className="">
          <div className="bg-white">
            <NavBar
              className="zb-b-b"
              mode="light"
              onLeftClick={routeActions.gotoPath.bind(this,'/dex/home')}
              leftContent={[
                <WebIcon key="1" type="home" theme="" />
              ]}
              rightContent={[
                <NumberOfTodos key="1"><span onClick={()=>showLayer({id:'notifications'})} className="text-primary fs16 mr10" key="1"><WebIcon type="bell" /></span></NumberOfTodos>,
                <span onClick={()=>showLayer({id:'helperOfFAQ'})} className="text-primary ml10" key="2"><WebIcon type="question-circle" /></span>
              ]}
            >
              <div className="color-black">
                {intl.get('p2p_order.order_title')}
              </div>
            </NavBar>
          </div>
          <div className="divider 1px zb-b-t"></div>
          <div className="bg-white">
            <Face2FaceForm side="sell" showLayer={showLayer} />
          </div>
          <div className="bg-white mt10">
            <div className="fs16 pt10 pb10 pl15 color-black-1 zb-b-b">{intl.get('common.reference_markets')}</div>
            <div className="zb-b-t">
              <HelperOfMarkets />
            </div>
          </div>
          <div className="bg-white mt10">
            <div className="fs16 pt10 pb10 pl15 color-black-1">{intl.get('user_center.my_assets')}</div>
            <div className="zb-b-t">
              <HelperOfBalances />
            </div>
          </div>
          <div className="bg-white mt10">
            <div className="fs16 pt10 pb10 pl15 color-black-1">{intl.get('user_center.my_orders')}</div>
            <div className="zb-b-t">
              <HelperOfOrders />
            </div>
          </div>
        </div>
    );
  }
}
export default connect(({placeOrder})=>({placeOrder}))(Face2FacePage)





