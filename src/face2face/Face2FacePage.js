import React from 'react'
import { NavBar, Tabs } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import { connect } from 'dva'
import routeActions from 'common/utils/routeActions'
import { getTokensByMarket } from 'modules/formatter/common'
import Face2FaceOrders from './Face2FaceOrders'
import HelperOfBalances from './HelperOfBalances'
import Face2FaceForm from './Face2FaceForm'
import intl from 'react-intl-universal'

class Face2FacePage extends React.Component {
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
    return (
        <div className="">
          <NavBar
            className="bg-white"
            mode="light"
            leftContent={[
              <span onClick={()=>showLayer({id:'helperOfFAQ'})} className="text-primary" key="1"><WebIcon type="question-circle-o" /></span>
            ]}
            rightContent={[
              <span  onClick={()=>{}} className="text-primary" key="1" ><WebIcon type="swap" /></span>
            ]}
          >
            <div className="color-black">
              Person To Person
            </div>
          </NavBar>
          <div className="bg-white"><div className="divider 1px zb-b-t"></div></div>
          <div className="bg-white">
            <Face2FaceForm side="sell" showLayer={showLayer} />
          </div>
          <div className="bg-white"><div className="divider 1px zb-b-t"></div></div>
          <div className="no-underline tabs-no-border">
            <Tabs
              tabs={
                [
                  { title: <div className="am-tabs-item-wrapper-bak"><div className="fs16 am-tabs-item-bak">{intl.get('common.balances')}</div></div> },
                  { title: <div className="am-tabs-item-wrapper-bak"><div className="fs16 am-tabs-item-bak">{intl.get('common.orders')}</div></div> },
                  { title: <div className="am-tabs-item-wrapper-bak"><div className="fs16 am-tabs-item-bak">行情</div></div> },
                ]
              }
              tabBarBackgroundColor="#fff"
              tabBarActiveTextColor={"#000"}
              tabBarInactiveTextColor={"#999"}
              initialPage={0}
              swipeable={false}
              onChange={(tab, index) => { console.log('onChange', index, tab); }}
              onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
            >
              <div className="zb-b-t">
                <HelperOfBalances />
              </div>
              <div className="">
                <Face2FaceOrders />
              </div>
              <div className="">
                Markets
              </div>
            </Tabs>
            <div className="pb50"></div>
          </div>
        </div>
    );
  }
}
export default connect(({placeOrder})=>({placeOrder}))(Face2FacePage)





