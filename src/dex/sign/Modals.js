import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import SignMessages from './SignMessages'
import SignResult from './SignResult'
import Login  from './Login'


function Modals(props) {
  return (
    <div>
      <Containers.Layers id="signMessages">
        <UiContainers.Popups id="signMessages" className="" style={{height:'100%'}}>
          <SignMessages />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="signResult">
        <UiContainers.Popups id="signResult" className="" style={{height:'100%'}}>
          <SignResult />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="login">
        <UiContainers.Popups id="login" className="" style={{height:'100%'}}>
          <Login />
        </UiContainers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
