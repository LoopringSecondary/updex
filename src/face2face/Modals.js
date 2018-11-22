import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import HelperOfTokens from './HelperOfTokens'
import HelperOfTTL from 'mobile/orders/HelperOfTTL'
import HelperOfMiniFill from './HelperOfMiniFill'
import HelperOfAmount from './HelperOfAmount'
import HelperOfFAQ from './HelperOfFAQ'
import HelperOfPrice from './HelperOfPrice'
import Face2FaceConfirm from './Face2FaceConfirm'
import OrderDetail from './Detail'
import OrderQrcode from './Qrcode'
import TakerConfirm from './TakerConfirm'
import Face2FacePage from './Face2FacePage'


function Modals(props) {
  return (
    <div>
      <Containers.Layers id="p2p">
        <UiContainers.Drawer maskClosable={false} position="right" id="p2p" className="h-100" style={{height:'100%',margin:'0 auto'}}>
          <Face2FacePage />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="p2pOrderDetail">
        <UiContainers.Popups id="p2pOrderDetail" position="right" className="h-100" style={{height:'100%',margin:'0 auto'}}>
          <OrderDetail />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfTokens">
        <UiContainers.Popups id="helperOfTokens" position="right" className="" style={{height:'100%',margin:'0 auto'}}>
          <HelperOfTokens />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="face2FaceConfirm">
        <UiContainers.Popups id="face2FaceConfirm" position="right" className="h-100" style={{height:'100%',margin:'0 auto'}}>
          <Face2FaceConfirm />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="takerConfirm">
        <UiContainers.Popups id="takerConfirm" position="right" className="h-100" style={{height:'100%',margin:'0 auto'}} >
          <TakerConfirm />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="orderQrcode">
        <UiContainers.Popups id="orderQrcode" zIndex={1091} position="right" className="h-100" style={{height:'100%',margin:'0 auto'}}>
          <OrderQrcode/>
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfTTL">
        <UiContainers.Popups id="helperOfTTL" zIndex={1091} position="right" className="" style={{height:'100%',margin:'0 auto'}}>
          <HelperOfTTL />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfMiniFill">
        <UiContainers.Popups id="helperOfMiniFill" position="right" className="" style={{height:'100%',margin:'0 auto'}}>
          <HelperOfMiniFill />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfFAQ">
        <UiContainers.Popups id="helperOfFAQ" position="right" className="h-100" style={{height:'100%',margin:'0 auto'}}>
          <HelperOfFAQ />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfPrice">
        <UiContainers.Popups id="helperOfPrice" position="right" className="" style={{height:'100%',margin:'0 auto'}}>
          <HelperOfPrice />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfAmountOfP2P">
        <UiContainers.Popups id="helperOfAmountOfP2P" alias="helperOfAmount" position="right" className="" style={{height:'100%',margin:'0 auto'}}>
          <HelperOfAmount />
        </UiContainers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
