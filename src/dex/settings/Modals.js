import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Settings from './Settings'
import SetLanguage from './SetLanguage'
import SetCurrency from './SetCurrency'
import SetLRCFee from './SetLRCFee'
import SetTTL from './SetTTL'
import HelperOfGas from './HelperOfGas'

export function SetLanguageModal(){
  return (
    <Containers.Layers id="setLanguage">
      <UiContainers.Popups id="setLanguage"  zIndex={1091} style={{margin:'0 auto',height:'100%'}}>
        <SetLanguage />
      </UiContainers.Popups>
    </Containers.Layers>
  )
}

export function SetCurrencyModal(){
  return (
    <Containers.Layers id="setCurrency">
      <UiContainers.Popups id="setCurrency"  zIndex={1091} style={{margin:'0 auto',height:'100%'}}>
        <SetCurrency />
      </UiContainers.Popups>
    </Containers.Layers>
  )
}
export function SetLRCFeeModal(){
  return (
    <Containers.Layers id="setLRCFee">
      <UiContainers.Popups id="setLRCFee"  zIndex={1091} style={{margin:'0 auto',height:'100%'}}>
        <SetLRCFee />
      </UiContainers.Popups>
    </Containers.Layers>
  )
}
export function SetTTLModal(){
  return (
    <Containers.Layers id="setTTL">
      <UiContainers.Popups id="setTTL"  zIndex={1091} style={{margin:'0 auto',height:'100%'}}>
        <SetTTL />
      </UiContainers.Popups>
    </Containers.Layers>
  )
}
export function HelperOfGasModal(){
  return (
    <Containers.Layers id="helperOfGas">
      <UiContainers.Popups id="helperOfGas"  style={{height:'100%'}}>
        <HelperOfGas />
      </UiContainers.Popups>
    </Containers.Layers>
  )
}

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="settings">
        <UiContainers.Popups  id="settings" zIndex={1090} level={null} className="h-100" style={{margin:'0 auto',height:'100%'}}>
          <Settings />
        </UiContainers.Popups>
      </Containers.Layers>
      <SetLanguageModal />
      <SetCurrencyModal />
      <SetLRCFeeModal />
      <SetTTLModal />
      <HelperOfGasModal />
    </div>
  )
}
export default Modals
