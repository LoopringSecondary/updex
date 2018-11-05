import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Notifications from './Notifications'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="notifications">
        <UiContainers.Drawer position="right" id="notifications" width="25vw"  style={{margin:'0 auto',height:'100%'}}>
          <Notifications />
        </UiContainers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals
