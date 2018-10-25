import historyProvider from './historyProvider'
import stream from './stream'

const supportedResolutions = ["1", "15", "60", "240", "D"]

const config = {
  supports_search: true,
  supports_group_request: false,
  supports_marks: true,
  exchanges: [],
  symbolsTypes: [],
  supported_resolutions: supportedResolutions
};

export function Datafeed() {
  return {
    onReady: cb => {
      console.log('=====onReady running')
      setTimeout(() => cb(config), 0)
    },
    searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
      console.log('====Search Symbols running')
    },
    resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
      // expects a symbolInfo object in response
      console.log('======resolveSymbol running:', symbolName)
      // console.log('resolveSymbol:',{symbolName})
      var split_data = symbolName.split(/[:/]/)
      // console.log({split_data})
      var symbol_stub = {
        name: symbolName,
        ticker: symbolName,
        description: symbolName,
        has_intraday: true,
        timezone: 'Asia/Shanghai',
        minmov: '1',
        minmov2: 0,
        session: '24x7',
        pricescale: 1000000,
        has_no_volume: false,
        // expired: true,
        // expiration_date: 1527379200000
      }

      setTimeout(function() {
        onSymbolResolvedCallback(symbol_stub)
        console.log('Resolving that symbol....', symbol_stub)
      }, 0)


      // onResolveErrorCallback('Not feeling it today')

    },
    getBars: function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
      console.log('=====getBars running')
      // console.log('function args',arguments)
      // console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
      historyProvider.getLoopringBars(symbolInfo, resolution, from, to, firstDataRequest)
        .then(bars => {
          console.log('...getLoopringBars...', bars)
          if (bars.length) {
            onHistoryCallback(bars, {noData: false})
          } else {
            onHistoryCallback(bars, {noData: true})
          }
        }).catch(err => {
        console.log({err})
        onErrorCallback(err)
      })
    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
      console.log('=====subscribeBars runnning')
      stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
    },
    unsubscribeBars: subscriberUID => {
      console.log('=====unsubscribeBars running')
      stream.unsubscribeBars(subscriberUID)
    },
    getServerTime: cb => {
      console.log('=====getServerTime running')
    }
  }
}
