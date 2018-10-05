import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Auth2 from './Auth2'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="auth2">
        <UiContainers.Drawer position="right" id="auth2" maskClosable={false} width="480px" style={{margin:'0 auto',padding:'0px 0px',height:'100%'}}>
          <Auth2 />
        </UiContainers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals
