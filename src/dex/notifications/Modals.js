import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Notifications from './Notifications'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="notifications">
        <UiContainers.Popups id="notifications" className="h100" style={{height:'100%'}}>
          <Notifications />
        </UiContainers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
