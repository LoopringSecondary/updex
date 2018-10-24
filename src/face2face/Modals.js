import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import HelperOfTokens from './HelperOfTokens'
import HelperOfTTL from './HelperOfTTL'
import HelperOfMiniFill from './HelperOfMiniFill'
import HelperOfAmount from './HelperOfAmount'
import HelperOfFAQ from './HelperOfFAQ'
import Face2FaceConfirm from './Face2FaceConfirm'
import OrderDetail from './Detail'
import OrderQrcode from './Qrcode'
import TakerConfirm from './TakerConfirm'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="p2pOrderDetail">
        <UiContainers.Popups id="p2pOrderDetail" className="h100" style={{height:'100%'}}>
          <OrderDetail />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfTokens">
        <UiContainers.Popups id="helperOfTokens">
          <HelperOfTokens />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="face2FaceConfirm">
        <UiContainers.Popups id="face2FaceConfirm">
          <Face2FaceConfirm />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="takerConfirm">
        <UiContainers.Popups id="takerConfirm" className="h-100" style={{height:'100%'}} >
          <TakerConfirm />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="orderQrcode">
        <UiContainers.Modals id="orderQrcode" className="rs">
          <OrderQrcode/>
        </UiContainers.Modals>
      </Containers.Layers>
      <Containers.Layers id="helperOfTTL">
        <UiContainers.Popups id="helperOfTTL">
          <HelperOfTTL />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfMiniFill">
        <UiContainers.Popups id="helperOfMiniFill">
          <HelperOfMiniFill />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfFAQ">
        <UiContainers.Popups id="helperOfFAQ" className="h-100" style={{height:'100%'}}>
          <HelperOfFAQ />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfAmount">
        <UiContainers.Popups id="helperOfAmount">
          <HelperOfAmount />
        </UiContainers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
