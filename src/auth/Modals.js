import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import AuthOfPC from './AuthOfPC'
import AuthOfMobile from './AuthOfMobile'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="auth2">
        <UiContainers.Drawer position="right" id="auth2" maskClosable={true} showMask={true} width="48rem" style={{margin:'0 auto',padding:'0px 0px',height:'100%'}}>
          <AuthOfPC />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="authOfMobile">
      	<UiContainers.Popups position="right" id="authOfMobile" style={{margin:'0 auto',padding:'0px 0px',height:'100%'}}>
      	  <AuthOfMobile />
      	</UiContainers.Popups>  
      </Containers.Layers>
    </div>
  )
}
export default Modals


