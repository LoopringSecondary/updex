const words = {
  reference_markets: 'Markets Reference',
  global_price: 'Global Price',
  exchange_ratio: 'Exchange Ratio',
}

export default {
  common: {
    ...words,
  },
  pages:{
  	'dex_home':{
  		title:'Home',
  		market_trade:'Market Trade',
  		market_trade_description:'Public Trade with everyone',
  		p2p_trade:'P2P Trade',
  		p2p_trade_description:'Privacy Trade with friends',
  		qrcode_trade:'Qrcode Trade',
  		qrcode_trade_description:'Safely Trade by scanning wherever',
  	},
  	'scan_trade':{
  		title:'Trade By Scanning',
  		description:'Trade by scanning qrcode on dex built on Loopring',
  		scan_login:'Login',
  		scan_sign:'Sign',
  		scan_place_order:'PlaceOrder',
  		scan_take_order:'TakeOrder',
  		scan_more:'More',
  		btn_scan:'Scan',
  		btn_home:'Home',
  	},
  },
  types:{},
}

