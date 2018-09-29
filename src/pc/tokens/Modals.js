import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Receive from './Receive'
import Convert from './ConvertForm'
import HelperOfEnable from './HelperOfEnable'
import HelperOfTokenActions from 'mobile/tokens/HelperOfTokenActions'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="receiveToken">
          <UiContianers.Modals id="receiveToken" className="rs">
            <Receive/>
          </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="helperOfEnable">
          <UiContianers.Popups id="helperOfEnable">
            <HelperOfEnable />
          </UiContianers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfTokenActions">
          <UiContianers.Panels id="helperOfTokenActions" className="rs h100" style={{width:'480px',margin:'0 auto',height:'100%'}}>
            <HelperOfTokenActions />
          </UiContianers.Panels>
      </Containers.Layers>
      <Containers.Layers id="convertToken" >
        <UiContianers.Panels id="convertToken" className="h100" style={{width:'480px',margin:'0 auto',height:'100%'}}>
          <Convert />
        </UiContianers.Panels>
      </Containers.Layers>
    </div>
  )
}
export default Modals
