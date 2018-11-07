import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import HelperOfGas from 'mobile/common/HelperOfGas'

export function HelperOfGasModal(){
  return (
    <Containers.Layers id="helperOfGas">
      <UiContainers.Drawer id="helperOfGas" position="right" width="27.5rem" style={{height:'100%'}}>
        <HelperOfGas />
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
