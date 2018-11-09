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
import OrderDetail from './Detail'
import OrderQrcode from './Qrcode'
import TakerConfirm from './TakerConfirm'
import Face2FacePage from './Face2FacePage'


function Modals(props) {
  return (
    <div>
      <Containers.Layers id="p2p">
        <UiContainers.Drawer maskClosable={false} position="right" id="p2p" className="h-100" style={{height:'100%',width:"32.5rem",margin:'0 auto'}}>
          <Face2FacePage />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="p2pOrderDetail">
        <UiContainers.Drawer id="p2pOrderDetail" position="right" className="h-100" style={{height:'100%',width:"32.5rem",margin:'0 auto'}}>
          <OrderDetail />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="helperOfTokens">
        <UiContainers.Drawer id="helperOfTokens" position="right" className="h-100" style={{height:'100%',width:"27.5rem",margin:'0 auto'}}>
          <HelperOfTokens />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="face2FaceConfirm">
        <UiContainers.Drawer id="face2FaceConfirm" position="right" className="h-100" style={{height:'100%',width:"32.5rem",margin:'0 auto'}}>
          <Face2FaceConfirm />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="takerConfirm">
        <UiContainers.Drawer id="takerConfirm" position="right" className="h-100" style={{height:'100%',width:"27.5rem",margin:'0 auto'}} >
          <TakerConfirm />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="orderQrcode">
        <UiContainers.Drawer id="orderQrcode" zIndex={1091} position="right" className="h-100" style={{height:'100%',width:"32.5rem",margin:'0 auto'}}>
          <OrderQrcode/>
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="helperOfTTL">
        <UiContainers.Drawer id="helperOfTTL" position="right" className="h-100" style={{height:'100%',width:"27.5rem",margin:'0 auto'}}>
          <HelperOfTTL />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="helperOfMiniFill">
        <UiContainers.Drawer id="helperOfMiniFill" position="right" className="h-100" style={{height:'100%',width:"27.5rem",margin:'0 auto'}}>
          <HelperOfMiniFill />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="helperOfFAQ">
        <UiContainers.Drawer id="helperOfFAQ" position="right" className="h-100" style={{height:'100%',width:"27.5rem",margin:'0 auto'}}>
          <HelperOfFAQ />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="helperOfPrice">
        <UiContainers.Drawer id="helperOfPrice" position="right" className="h-100" style={{height:'100%',width:"27.5rem",margin:'0 auto'}}>
          <HelperOfPrice />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="helperOfAmountOfP2P">
        <UiContainers.Drawer id="helperOfAmountOfP2P" alias="helperOfAmount" position="right" className="h-100" style={{height:'100%',width:"27.5rem",margin:'0 auto'}}>
          <HelperOfAmount />
        </UiContainers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals
