import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import HelperOfSignSteps from './HelperOfSignSteps'


export function HelperOfSignStepsModal(){
	return (
		<Containers.Layers id="helperOfSignStepPC">
		  <UiContainers.Drawer id="helperOfSignStepPC" position="right" width="30vw" style={{height:'100%'}}>
		    <HelperOfSignSteps />
		  </UiContainers.Drawer>
		</Containers.Layers>
	)	
}

function Modals(props) {
  return (
    <div>
      <HelperOfSignStepsModal />
    </div>
  )
}
export default Modals
