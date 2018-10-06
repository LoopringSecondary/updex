import * as React from 'react';
import './index.css';
import {connect} from "dva";
import historyProvider from "./api/historyProvider";
import themes from "./themes.js";

const theme = themes[themes.selected]

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

class TVChartContainer extends React.PureComponent {

	state = {
    containerId: 'tv_chart_container',
	  barsLoaded: false
  }

  tvWidget = null;

  componentDidMount() {
    //const param = location.pathname.replace(`${match.path}/`, '')
    const symbol = window.location.hash.split('/')[3] || 'LRC-WETH'
	  this.initChart(symbol)
  }

  componentWillUnmount() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

	initChart(symbol) {
	  const _this = this
		const widgetOptions = {
			debug: false,
			symbol: symbol,
			datafeed: {
        onReady: cb => {
          console.log('=====onReady running')
          setTimeout(() => cb({
            supports_search: true,
            supports_group_request: false,
            supports_marks: true,
            exchanges: [],
            symbolsTypes: [],
            supported_resolutions: ["1", "15", "60", "240", "D"]
          }), 0)
        },
        searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
          console.log('====Search Symbols running')
        },
        resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
          window.SYMBOLE_CHANGE = onSymbolResolvedCallback
          setTimeout(() => {
            onSymbolResolvedCallback({
              name: symbolName.toUpperCase(),
              ticker: symbolName.toUpperCase(),
              description: symbolName.toUpperCase(),
              has_intraday: true,
              timezone: 'Asia/Shanghai',
              minmov: '1',
              minmov2: 0,
              session: '24x7',
              pricescale: 1000000,
              has_no_volume: false,
              volume_precision:5
              // expired: true,
              // expiration_date: 1527379200000
            })
          }, 0)
        },
        getBars: function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
          console.log('=====getBars running', _this.state.barsLoaded)
          if (_this.state.barsLoaded) {
            setTimeout(() => {
              onHistoryCallback([], {noData: true})
            }, 0)
          } else {
            historyProvider.getLoopringBars(symbolInfo, resolution, from, to, firstDataRequest)
              .then(bars => {
                _this.setState({barsLoaded: true})
                if (bars.length) {
                  onHistoryCallback(bars, {noData: false})
                } else {
                  onHistoryCallback(bars, {noData: true})
                }
              }).catch(err => {
                console.log({err})
                onErrorCallback(err)
              })
          }
        },
        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
          console.log('=====subscribeBars runnning')
          window.TrendCallBack = onRealtimeCallback
          //TODO mock
          // let time = 1536745511000
          // setInterval(() => {
          //   const mock = {
          //     close:0.0012,
          //     high:0.004,
          //     //isBarClosed: true,
          //     //isLastBar: false,
          //     low:0.0011,
          //     open:0.0012,
          //     time:time,
          //     volume:12
          //   }
          //   time = time + 3600000
          //   //onRealtimeCallback(mock)
          // }, 1000)
          //stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
        },
        unsubscribeBars: subscriberUID => {
          console.log('=====unsubscribeBars running')
          //stream.unsubscribeBars(subscriberUID)
        },
        getServerTime: cb => {
          console.log('=====getServerTime running')
        }
      },
      interval: 60,
      timeframe: '1M',
      // toolbar_bg: "rgba(0,0,0,0)",
			container_id: this.state.containerId,
			library_path: '/charting_library/',
			locale: getLanguageFromURL() || 'zh',
      disabled_features: [
        "use_localstorage_for_settings",
        "header_widget",
        // "context_menus",
        "edit_buttons_in_legend",
        // "border_around_the_chart",
        // "control_bar",
        "timeframes_toolbar",
        "left_toolbar",
        "volume_force_overlay"
      ],
			enabled_features: [
			  // 'move_logo_to_main_pane',
        'hide_last_na_study_output'
      ],
			charts_storage_url: 'https://saveload.tradingview.com',
			charts_storage_api_version: '1.1',
			client_id: 'tradingview.com',
			user_id: 'public_user_id',
      width: '100%',
      height: '100%',
			fullscreen: false,
			autosize:true,
      loading_screen: {
        backgroundColor: "rgba(0,0,0,0)"
      },
      overrides: {
        editorFontsList: ['RobotoCondensed','Times New Roman', 'Arial'] ,
        // 蜡烛图
        "mainSeriesProperties.candleStyle.upColor": theme.green,
        "mainSeriesProperties.candleStyle.borderUpColor": theme.green,
        "mainSeriesProperties.candleStyle.wickUpColor": theme.green,

        "mainSeriesProperties.candleStyle.downColor": theme.red,// theme.red,
        "mainSeriesProperties.candleStyle.borderDownColor": theme.red,
        "mainSeriesProperties.candleStyle.wickDownColor": theme.red,

        "paneProperties.background":theme.bg, // 背景色彩，如果带透明度会出bug
        "paneProperties.vertGridProperties.color": theme.grid, // 背景网格颜色
        "paneProperties.horzGridProperties.color": theme.grid, // 背景网格颜色

        // // x,y周
        "scalesProperties.lineColor": theme.line, // x,y坐标轴的颜色,背景无bug时正常显示
        "scalesProperties.textColor": theme.text, // x,y坐标轴字体的颜色,背景无bug时正常显示

        "volumePaneSize": "medium",
        "mainSeriesProperties.showCountdown": false,
        "symbolWatermarkProperties.transparency": 0,
        "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0.00)",
        // // 边际（百分比） 用于自动缩放。
        "paneProperties.topMargin": 10,
        "paneProperties.bottomMargin":0,
      },
      studies_overrides: {
        //--------------------volume
        "volume.volume.color.0": theme.red,
        "volume.volume.color.1": theme.green,
      }
		};
    const tvWidget = new window.TradingView.widget(widgetOptions);
    this.tvWidget = tvWidget
    tvWidget.onChartReady(() => {
      console.log('Chart has loaded!', tvWidget)
    });
	}

	render() {
		return (
			<div
				id={ this.state.containerId }
        style={{height:'100%'}}
				className={ 'TVChartContainer' }
			/>
		);
	}
}

function mapToProps(state) {
  return {
    trends:state.sockets.trends.items,
  }
}

export default (connect(mapToProps)(TVChartContainer));
