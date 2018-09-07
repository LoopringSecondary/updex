
export default  function isWeixin() {
  var ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('micromessenger') !== -1
}
