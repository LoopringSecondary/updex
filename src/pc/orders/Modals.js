import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import OrderDetail from 'mobile/orders/Detail'
import PlaceOrderSteps from './PlaceOrderSteps'
import HelperOfPrice from './HelperOfPrice'
import HelperOfAmount from './HelperOfAmount'
import HelperOfMarket from './HelperOfMarket'
import CancelOrderConfirm  from './CancelOrderConfirm'
import HelperOfTTL from './HelperOfTTL'
import HelperOfLRCFee from './HelperOfLRCFee'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="orderDetail">
        <UiContainers.Drawer position="right" id="orderDetail" showMask={true} level={null} width="30vw" style={{height:'100%'}}>
          <OrderDetail />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="placeOrderSteps" >
        <UiContainers.Drawer position="right" wrapperClassName="orderConfirm" id="placeOrderSteps" level={'all'} width="30vw" style={{margin:'0 auto',height:'100%'}}>
          <PlaceOrderSteps />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="helperOfLRCFee">
        <UiContainers.Popups id="helperOfLRCFee">
          <HelperOfLRCFee />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="cancelOrderConfirm">
        <UiContainers.Popups id="cancelOrderConfirm">
          <CancelOrderConfirm />
        </UiContainers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
