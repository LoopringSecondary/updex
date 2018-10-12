import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Notifications from './Notifications'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="tasks">
        <UiContainers.Drawer position="right" id="tasks" width="48rem"  style={{margin:'0 auto',height:'100%'}}>
          <Notifications />
        </UiContainers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals
