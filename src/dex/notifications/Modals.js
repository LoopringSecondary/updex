import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import NotificationsModal from './NotificationsModal'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="notifications">
        <UiContainers.Popups id="notifications" className="h-100" style={{margin:'0 auto',height:'100%'}}>
          <NotificationsModal />
        </UiContainers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals