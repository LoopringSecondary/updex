import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Auth from './Auth'
import UnlockByAddress from './UnlockByAddress'
import UnlockByLoopr from './UnlockByLoopr'
import UnlockByMetaMask from './UnlockByMetamask'
import UnlockByLedger from './UnlockByLedger'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="authOfPC">
        <UiContainers.Drawer position="right" id="authOfPC" zIndex={1090} maskClosable={false} showMask={true} width="32.5rem" style={{margin:'0 auto',padding:'0px 0px',height:'100%'}}>
          <Auth />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="unlockByAddress">
        <UiContainers.Drawer position="right" id="unlockByAddress" zIndex={1091} maskClosable={false} showMask={true} width="27.5rem" style={{margin:'0 auto',padding:'0px 0px',height:'100%'}}>
          <UnlockByAddress />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="unlockByLoopr">
        <UiContainers.Drawer position="right" id="unlockByLoopr" zIndex={1091} maskClosable={false} showMask={true} width="27.5rem" style={{margin:'0 auto',padding:'0px 0px',height:'100%'}}>
          <UnlockByLoopr />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="unlockByMetaMask">
        <UiContainers.Drawer position="right" id="unlockByMetaMask" zIndex={1091} maskClosable={false} showMask={true} width="27.5rem" style={{margin:'0 auto',padding:'0px 0px',height:'100%'}}>
          <UnlockByMetaMask />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="unlockByLedger">
        <UiContainers.Drawer position="right" id="unlockByLedger" zIndex={1091} maskClosable={false} showMask={true} width="27.5rem" style={{margin:'0 auto',padding:'0px 0px',height:'100%'}}>
          <UnlockByLedger />
        </UiContainers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals


