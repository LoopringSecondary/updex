import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Detail from './Detail'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="txDetail">
        <UiContainers.Popups id="txDetail" className="" style={{height:'100%'}}>
          <Detail />
        </UiContainers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
