import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Receive from 'mobile/tokens/Receive'
import Convert from './ConvertForm'
import HelperOfEnable from './HelperOfEnable'
import HelperOfTokenActions from 'mobile/tokens/HelperOfTokenActions'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="receiveToken">
          <UiContianers.Drawer id="receiveToken" position="right" className="h100" style={{width:'27.5rem',margin:'0 auto',height:'100%'}}>
            <Receive/>
          </UiContianers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="helperOfEnable">
          <UiContianers.Popups id="helperOfEnable">
            <HelperOfEnable />
          </UiContianers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfTokenActions">
          <UiContianers.Panels id="helperOfTokenActions" position="right"  className="rs h100" style={{width:'27.5rem',margin:'0 auto',height:'100%'}}>
            <HelperOfTokenActions />
          </UiContianers.Panels>
      </Containers.Layers>
      <Containers.Layers id="convertToken" >
        <UiContianers.Drawer id="convertToken" closable={false} position="right" className="h100" style={{width:'27.5rem',margin:'0 auto',height:'100%'}}>
          <Convert />
        </UiContianers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals
