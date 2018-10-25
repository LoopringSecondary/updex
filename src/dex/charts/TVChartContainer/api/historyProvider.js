const history = {}

const sorter = (a, b)=>{
  return a.start - b.start;
};

export default {
	history: history,
  getLoopringBars: async function(symbolInfo, resolution, from, to, first, limit) {
    // 1Hr, 2Hr, 4Hr, 1Day, 1Week
    let interval = '1Hr'
    switch (resolution) {
      case '60': interval = '1Hr'; break;
      case '120': interval = '2Hr'; break;
      case '240': interval = '4Hr'; break;
      case 'D': interval = '1Day'; break;
      case 'W': interval = '1Week'; break;
    }
    const res = await window.RELAY.market.getTrend({market:symbolInfo.name, interval})
    console.log("trends  .....  ", res)
    if(res.result && res.result.length > 0) {
      const bars = res.result.sort(sorter).map(trend=> {
        return {
          close:trend.close,
          high:trend.high,
          //isBarClosed: true,
          //isLastBar: false,
          low:trend.low,
          open:trend.open,
          time:trend.start * 1000,
          volume:trend.vol
        }
      })
      if (first) {
        var lastBar = bars[bars.length - 1]
        history[symbolInfo.name] = {lastBar: lastBar}
      }
      return bars
    } else {
      return []
    }
  }
}
