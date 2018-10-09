import {getTokensByMarket} from 'modules/formatter/common'

export const getMarketTickersBySymbol = (symbol,tickers)=>{
  return tickers.filter(ticker=>{
    const tokens = getTokensByMarket(ticker.market)
    return tokens.right === symbol
  })
}

export const searchMarkets = (symbol,tickers)=>{
  return tickers.filter(ticker=>{
    const tokens = getTokensByMarket(ticker.market)
    if(symbol.indexOf('/') > -1) {
      const searchMarket = symbol.split('/')
      if(searchMarket[1]) {
        return tokens.left === searchMarket[0].toUpperCase() && tokens.right.startsWith(searchMarket[1].toUpperCase())
      } else {
        return tokens.left === searchMarket[0].toUpperCase()
      }
    } else {
      return tokens.right.indexOf(symbol.toUpperCase()) > -1 || tokens.left.indexOf(symbol.toUpperCase()) > -1
    }
  })
}
