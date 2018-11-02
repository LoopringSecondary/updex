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
        <UiContainers.Drawer position="right" id="authOfPC" maskClosable={false} showMask={true} width="48rem" style={{margin:'0 auto',padding:'0px 0px',height:'100%'}}>
          <Auth />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="unlockByAddress">
        <UiContainers.Drawer position="right" id="unlockByAddress" maskClosable={false} showMask={true} width="48rem" style={{margin:'0 auto',maxWidth:'48rem',padding:'0px 0px',height:'100%'}}>
          <UnlockByAddress />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="unlockByLoopr">
        <UiContainers.Drawer position="right" id="unlockByLoopr" maskClosable={false} showMask={true} width="48rem" style={{margin:'0 auto',maxWidth:'48rem',padding:'0px 0px',height:'100%'}}>
          <UnlockByLoopr />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="unlockByMetaMask">
        <UiContainers.Drawer position="right" id="unlockByMetaMask" maskClosable={false} showMask={true} width="48rem" style={{margin:'0 auto',maxWidth:'48rem',padding:'0px 0px',height:'100%'}}>
          <UnlockByMetaMask />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="unlockByLedger">
        <UiContainers.Drawer position="right" id="unlockByLedger" maskClosable={false} showMask={true} width="48rem" style={{margin:'0 auto',maxWidth:'48rem',padding:'0px 0px',height:'100%'}}>
          <UnlockByLedger />
        </UiContainers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals


