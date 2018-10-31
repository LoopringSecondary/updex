import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import ListMarketTickers from './ListMarketTickersPage'
function Modals(props) {
  return (
    <div>
      <Containers.Layers id="ListMarketTickers">
        <UiContianers.Drawer id="ListMarketTickers" position="left" style={{height:'100%',width:'44.1rem'}}>
          <ListMarketTickers />
        </UiContianers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals
