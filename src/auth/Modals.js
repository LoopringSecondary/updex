import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Auth2 from './Auth2'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="auth2">
        <UiContainers.Drawer position="right" id="auth2" level={null} width="480px"  style={{margin:'0 auto',height:'100%'}}>
          <Auth2 />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="auth">
        <UiContainers.Popups id="auth" visible={true} className="h100" style={{margin:'0 auto',height:'100%'}}>
          <Auth2 />
        </UiContainers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
