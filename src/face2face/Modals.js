import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import HelperOfTokens from './HelperOfTokens'
import HelperOfTTL from './HelperOfTTL'
import HelperOfMiniFill from './HelperOfMiniFill'
import HelperOfAmount from './HelperOfAmount'
import HelperOfFAQ from './HelperOfFAQ'
import HelperOfPrice from './HelperOfPrice'
import Face2FaceConfirm from './Face2FaceConfirm'
import Settings from './Settings'
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
        <UiContainers.Popups id="face2FaceConfirm" className="h100" style={{height:'100%'}}>
          <Face2FaceConfirm />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="takerConfirm">
        <UiContainers.Popups id="takerConfirm" className="h-100" style={{height:'100%'}} >
          <TakerConfirm />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="orderQrcode">
        <UiContainers.Popups id="orderQrcode" className="h-100" style={{height:'100%'}}>
          <OrderQrcode/>
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfTTL">
        <UiContainers.Popups id="helperOfTTL" className="" style={{}}>
          <HelperOfTTL />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfMiniFill">
        <UiContainers.Popups id="helperOfMiniFill" className="" style={{}}>
          <HelperOfMiniFill />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfFAQ">
        <UiContainers.Popups id="helperOfFAQ" className="h-100" style={{height:'100%'}}>
          <HelperOfFAQ />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="settings">
        <UiContainers.Popups id="settings" className="h-100" style={{height:'100%'}}>
          <Settings />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfPrice">
        <UiContainers.Popups id="helperOfPrice" className="h-100" style={{height:'100%'}}>
          <HelperOfPrice />
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
