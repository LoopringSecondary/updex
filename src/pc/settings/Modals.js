import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Settings from 'mobile/settings/Settings'
import SetLanguage from 'mobile/settings/SetLanguage'
import SetCurrency from 'mobile/settings/SetCurrency'
import SetLayout from 'mobile/settings/SetLayout'


export function SetLanguageModal(){
  return (
    <Containers.Layers id="setLanguage">
      <UiContainers.Drawer id="setLanguage" position="right" style={{margin:'0 auto',height:'100%',width:'40rem'}}>
        <SetLanguage />
      </UiContainers.Drawer>
    </Containers.Layers>
  )
}
export function SetCurrencyModal(){
  return (
    <Containers.Layers id="setCurrency">
      <UiContainers.Drawer id="setCurrency" position="right" style={{margin:'0 auto',height:'100%',width:'40rem'}}>
        <SetCurrency />
      </UiContainers.Drawer>
    </Containers.Layers>
  )
}
export function SetLayoutModal(){
  return (
    <Containers.Layers id="setLayout">
      <UiContainers.Drawer id="setLayout" position="right" style={{margin:'0 auto',height:'100%',width:'40rem'}}>
        <SetLayout />
      </UiContainers.Drawer>
    </Containers.Layers>
  )
}


function Modals(props) {
  return (
    <div>
      <Containers.Layers id="settings">
        <UiContainers.Drawer position="right" id="settings" level={null} style={{margin:'0 auto',height:'100%',width:'48rem'}}>
          <Settings />
        </UiContainers.Drawer>
      </Containers.Layers>
      <SetLanguageModal />
      <SetCurrencyModal />
      <SetLayoutModal />
    </div>
  )
}
export default Modals
