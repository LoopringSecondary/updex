import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Settings from 'mobile/account/Settings'
import UserCenter from './UserCenter'
import ChooseLedgerAddress from './ChooseLedgerAddress'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="settings">
        <UiContainers.Drawer position="right" id="settings" level={null} width="48rem"  style={{margin:'0 auto',height:'100%'}}>
          <Settings />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="usercenter">
        <UiContainers.Drawer position="right" id="usercenter" width="56rem"  style={{margin:'0 auto',height:'100%'}}>
          <UserCenter />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="chooseLedgerAddress">
        <UiContainers.Drawer id="chooseLedgerAddress" position="right">
          <ChooseLedgerAddress />
        </UiContainers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals
