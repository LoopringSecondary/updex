import p2p from './p2p'
import home from './home'

export default {
  common: {
    ...p2p.common,
    ...home.common,
  },
  pages:{
  	...p2p.pages,
  	...home.pages,
  },
  types:{
		...p2p.types,
		...home.types,
  },
}

