import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Detail from './Detail'
import Etherscan from './Etherscan'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="txDetail">
        <UiContainers.Popups id="txDetail" className="" style={{height:'100%'}}>
          <Detail />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="etherscan">
        <UiContainers.Popups id="etherscan" className="h-100" style={{height:'100%'}}>
          <Etherscan />
        </UiContainers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
