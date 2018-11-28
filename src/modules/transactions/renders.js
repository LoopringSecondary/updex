import intl from 'react-intl-universal'
import commonFm from 'modules/formatter/common'

const handleCopy = (value, e) => {
  e.preventDefault();
  e.clipboardData.setData("text", value);
};

export const getTxHash = (txHash)=>{
  return <a href={`https://etherscan.io/tx/${txHash}`}>{commonFm.getShortAddress(txHash)}</a>
}
export const getTo = (to)=>{
  return <span>{commonFm.getShortAddress(to)}</span>
}

export const TxRender = {
  getTxHash,
  getTo,
}