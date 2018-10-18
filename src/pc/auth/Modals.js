import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Auth from './Auth'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="authOfPC">
        <UiContainers.Drawer position="right" id="authOfPC" maskClosable={true} showMask={true} width="48rem" style={{margin:'0 auto',padding:'0px 0px',height:'100%'}}>
          <Auth />
        </UiContainers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals


