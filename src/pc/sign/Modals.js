import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import HelperOfSignSteps from './HelperOfSignSteps'


export function HelperOfSignStepsModal(){
	return (
		<Containers.Layers id="helperOfSignStepPC">
		  <UiContainers.Drawer id="helperOfSignStepPC" position="right" width="32.5rem" zIndex={1100} style={{height:'100%'}}>
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

// zIndex note:
// sign: 1100
// settings: 1090-1091
// auth: 1090-1091