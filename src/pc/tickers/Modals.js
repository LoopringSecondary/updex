import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import ListMarketTickers from './ListMarketTickersPage'
function Modals(props) {
  return (
    <div>
      <Containers.Layers id="ListMarketTickers">
        <UiContianers.Panels id="ListMarketTickers" positon="left" style={{height:'100%',width:'480px'}}>
          <ListMarketTickers />
        </UiContianers.Panels>
      </Containers.Layers>
    </div>
  )
}
export default Modals
