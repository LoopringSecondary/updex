import intl from 'react-intl-universal'
import commonFm from 'modules/formatter/common'

const handleCopy = (value, e) => {
  e.preventDefault();
  e.clipboardData.setData("text", value);
};

export const getTxHash = (txHash)=>{
  return <span>{commonFm.getShortAddress(txHash)}</span>
}
export const getTo = (to)=>{
  return <span>{commonFm.getShortAddress(to)}</span>
}
export const getGas = (to)=>{
  return (
    <div className="mr15">
      <div className="text-right fs14 color-black-1">{`00  ETH`}</div>
      <div className="text-right fs12 color-black-3">{`Gas( 00 ) * Gas Price( 00 Gwei)`}</div>
    </div>
  )
}

export const TxRender = {
  getTxHash,
  getTo,
  getGas,
}