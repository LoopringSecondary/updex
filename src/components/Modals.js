import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import HelperOfGas from './HelperOfGas'
import HelperOfSignByThirdWallet from './HelperOfSignByThirdWallet'
import HelperOfSignByThirdWalletPC from './HelperOfSignByThirdWalletPC'
import HelperOfSignStepPC from './HelperOfSignStepPC'
function Modals(props) {
  return (
    <div>
      <Containers.Layers id="helperOfGas">
        <UiContainers.Popups id="helperOfGas">
          <HelperOfGas />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfSign">
        <UiContainers.Popups id="helperOfSign">
          <HelperOfSignByThirdWallet />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfSignPC">
        <UiContainers.Drawer id="helperOfSignPC" position="right" width="480px" style={{height:'100%'}}>
          <HelperOfSignByThirdWalletPC />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="helperOfSignStepPC">
        <UiContainers.Drawer id="helperOfSignStepPC" position="right" width="480px" style={{height:'100%'}}>
          <HelperOfSignStepPC />
        </UiContainers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals
