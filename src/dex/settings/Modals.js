import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Settings from './Settings'
import SetLanguage from './SetLanguage'
import SetCurrency from './SetCurrency'


export function SetLanguageModal(){
  return (
    <Containers.Layers id="setLanguage">
      <UiContainers.Drawer id="setLanguage" position="right" style={{height:'100%',width:'40rem'}}>
        <SetLanguage />
      </UiContainers.Drawer>
    </Containers.Layers>
  )
}
export function SetCurrencyModal(){
  return (
    <Containers.Layers id="setLanguage">
      <UiContainers.Drawer id="setLanguage" position="right" style={{height:'100%',width:'40rem'}}>
        <SetCurrency />
      </UiContainers.Drawer>
    </Containers.Layers>
  )
}

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="settings">
        <UiContainers.Popups id="settings" position="right"  style={{height:'100%',width:'48rem'}}>
          <Settings />
        </UiContainers.Popups>
      </Containers.Layers>
      <SetLanguageModal />
      <SetCurrencyModal />
    </div>
  )
}
export default Modals
