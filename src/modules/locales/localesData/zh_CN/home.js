const words = {
  reference_markets: '行情参考',
  global_price: '全网价',
  exchange_ratio: '兑换比例',
}

export default {
  common: {
    ...words,
  },
  pages:{
  	'dex_home':{
  		title:'首页',
  		market_trade:'市场交易',
  		market_trade_description:'和所有人自由公开交易',
  		p2p_trade:'P2P交易',
  		p2p_trade_description:'和朋友们私密地交易',
  		qrcode_trade:'扫码交易',
  		qrcode_trade_description:'通过二维码随时随地地交易',
  	},
  	'scan_trade':{
  		title:'路印扫码交易',
  		description:'通过二维码快速简单安全地交易',
  		scan_login:'扫码登录',
  		scan_sign:'扫码签名',
  		scan_place_order:'扫码下单',
  		scan_take_order:'扫码吃单',
  		scan_more:'更多',
  		btn_scan:'扫码',
  		btn_home:'首页',
  	},
  },
  types:{},
}

