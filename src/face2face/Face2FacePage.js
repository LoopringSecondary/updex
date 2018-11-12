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

  componentDidMount(){
     window.handleP2POrder({result:JSON.stringify({value:{"auth":"353dfae76f2fa7956b293ce26ccaaf7d7b6e6c0b1c7bf329e6f0c533a7076b5a","hash":"0x8d6a064415b246065c297f47858cb84d57c3186726a5451fbb4b7f654dc39035","count":1}})})
  }
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
              leftContent={[
                <NumberOfTodos><span onClick={()=>showLayer({id:'notifications'})} className="text-primary fs16" key="1"><WebIcon type="bell" theme="" /></span></NumberOfTodos>,
                <span hidden onClick={()=>showLayer({id:'settings'})} className="text-primary" key="1"><WebIcon type="setting" theme="" /></span>
              ]}
              rightContent={[
                <span onClick={()=>showLayer({id:'helperOfFAQ'})} className="text-primary" key="1"><WebIcon type="question-circle" theme="" /></span>
              ]}
            >
              <div className="color-black">
                {intl.get('p2p_order.order_title')}
              </div>
            </NavBar>
          </div>
          <div className="bg-white">
            <Face2FaceForm side="sell" showLayer={showLayer} />
          </div>
          <div hidden className="bg-white mt10">
            <div className="fs16 pt10 pb10 pl15 color-black-1">{intl.get('common.markets')}</div>
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





