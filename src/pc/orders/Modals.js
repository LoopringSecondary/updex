import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import OrderDetail from '../orders/Detail'
import PlaceOrderSteps from 'mobile/orders/PlaceOrderSteps'
import HelperOfAdvance from './HelperOfAdvance'
import HelperOfPrice from './HelperOfPrice'
import HelperOfAmount from './HelperOfAmount'
import HelperOfMarket from './HelperOfMarket'
import CancelOrderConfirm  from './CancelOrderConfirm'
import HelperOfTTL from './HelperOfTTL'
import HelperOfLRCFee from './HelperOfLRCFee'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="orderDetail" wrapClassName="modal-wrapper">
        <UiContainers.Modals id="orderDetail">
          <OrderDetail />
        </UiContainers.Modals>
      </Containers.Layers>
      <Containers.Layers id="placeOrderSteps" className="" wrapClassName="modal-wrapper">
        <UiContainers.Modals id="placeOrderSteps">
          <PlaceOrderSteps />
        </UiContainers.Modals>
      </Containers.Layers>
      <Containers.Layers id="helperOfAdvance">
        <UiContainers.Popups id="helperOfAdvance">
          <HelperOfAdvance />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfPrice">
        <UiContainers.Popups id="helperOfPrice">
          <HelperOfPrice />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfAmount">
        <UiContainers.Popups id="helperOfAmount">
          <HelperOfAmount />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfMarket">
        <UiContainers.Popups id="helperOfMarket">
          <HelperOfMarket />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfTTL">
        <UiContainers.Popups id="helperOfTTL">
          <HelperOfTTL />
        </UiContainers.Popups>
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
