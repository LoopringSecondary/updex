import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Auth from './Auth'
import UnlockByAddress from './UnlockByAddress'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="authOfMobile">
      	<UiContainers.Popups id="authOfMobile" className="h-100" style={{margin:'0 auto',padding:'0px 0px',height:'100%'}}>
      	  <Auth />
      	</UiContainers.Popups>  
      </Containers.Layers>
      <Containers.Layers id="unlockByAddress">
      	<UiContainers.Popups id="unlockByAddress" className="h-100" style={{margin:'0 auto',padding:'0px 0px',height:'100%'}}>
      	  <UnlockByAddress />
      	</UiContainers.Popups>  
      </Containers.Layers>
    </div>
  )
}
export default Modals


