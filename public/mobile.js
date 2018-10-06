var useragent = navigator.userAgent
var isMobile = useragent.match(/AppleWebKit.*Mobile.*/)
if(isMobile){
  location.href = '/#/auth'
}else{
  location.href = '/#/pc/trade/LRC-WETH'
}