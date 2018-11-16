import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import SignMessages from './SignMessages'
import SignResult from './SignResult'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="signMessages">
        <UiContainers.Popups id="signMessages" className="" style={{height:'100%'}}>
          <SignMessages />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="signResult">
        <UiContainers.Popups id="signResult" className="h-100" style={{height:'100%'}}>
          <SignResult />
        </UiContainers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
