export const getOverrides = () => {
    // const { RG, theme } = this.props
    const RG = null
    const theme = 'dark'
    let THEME = {LIGHT:null}
    let XYcolor = "#bec0cd"
    // const backColor = theme === THEME.LIGHT ? 'white' : '#1D1D1D'
    const backColor = theme === THEME.LIGHT ? '#1D1D1D' : 'white'
    // const green = RG ? "#00C087" : "#FF7858"
    const green = RG ? "#FF7858" : "#00C087"
    // const red = RG ? "#FF7858" : "#00C087"
    const red = RG ? "#00C087" : "#FF7858"
    const greenOpacity = RG ? "rgba(255,120,88,.4)" : "rgba(0,192,135,.4)"
    const redOpacity = RG ? "rgba(0,192,135,.4)" : "rgba(255,120,88,.4)"
    const textLineColor = theme === THEME.LIGHT ? '#bec0cd' : XYcolor
    return {
      overrides: {
        // 蜡烛图
        "mainSeriesProperties.candleStyle.upColor": green,
        "mainSeriesProperties.candleStyle.borderUpColor": green,
        "mainSeriesProperties.candleStyle.wickUpColor": green,

        "mainSeriesProperties.candleStyle.downColor": red,// "#d75442",
        "mainSeriesProperties.candleStyle.borderDownColor": red,
        "mainSeriesProperties.candleStyle.wickDownColor": red,

        "paneProperties.background": backColor,

        //----------------- x,y坐标轴的颜色，字体颜色
        "scalesProperties.lineColor": textLineColor,
        "scalesProperties.textColor": textLineColor,
      },
      studies_overrides: {
        //--------------------volume的颜色设置
        "volume.volume.color.0": greenOpacity,
        "volume.volume.color.1": redOpacity,
      }
    }
  }