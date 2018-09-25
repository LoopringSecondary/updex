import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import ListMarketTickers from './ListMarketTickersPage'
function Modals(props) {
  return (
    <div>
      <Containers.Layers id="ListMarketTickers">
        <UiContianers.Popups id="ListMarketTickers" width="450px">
          <ListMarketTickers />
        </UiContianers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
