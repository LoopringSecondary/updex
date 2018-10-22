import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import SignByLoopr from './SignByLoopr'

export function SignByLooprModal(){
	return (
		<Containers.Layers id="signByLoopr">
		  <UiContainers.Drawer id="signByLoopr" position="right" width="480px" style={{height:'100%'}}>
		    <SignByLoopr />
		  </UiContainers.Drawer>
		</Containers.Layers>
	)	
}
function Modals(props) {
  return (
    <div>
      
    </div>
  )
}
export default Modals
