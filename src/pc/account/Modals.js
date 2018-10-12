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
        <UiContainers.Panels position="right" id="usercenter" width="48rem"  style={{margin:'0 auto',height:'100%'}}>
          <UserCenter />
        </UiContainers.Panels>
      </Containers.Layers>
      <Containers.Layers id="chooseLedgerAddress">
        <UiContainers.Panels id="chooseLedgerAddress" position="right">
          <ChooseLedgerAddress />
        </UiContainers.Panels>
      </Containers.Layers>
    </div>
  )
}
export default Modals
