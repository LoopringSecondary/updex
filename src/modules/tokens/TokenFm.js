import {toBig, toNumber,toFixed} from "LoopringJS/common/formatter";
import {formatLength, toUnitAmount, toDecimalsAmount, getFormatNum} from "../formatter/common";
import config from 'common/config'
import validator from 'LoopringJS/common/validator'

export default class TokenFm {
  constructor(token){
      const {symbol,address} = token;
      let tokenConfig = {};
      if(symbol){
        tokenConfig = config.getTokenBySymbol(symbol) || {}
      }else{
        if(address){
          tokenConfig = config.getTokenByAddress(address) || {}
        }else{
          throw new Error('token.symbol or token.symbol must not be empty')
        }
      }
      let newToken = {...tokenConfig,...token};
      let keys = Object.keys(newToken);
      keys.forEach(key=>{
        this[key] = newToken[key]
      })
  }
  getToken(){
    let keys = Object.keys(this);
    let token = {};
    keys.forEach(key=>{
      token[key] = this[key]
    });
    return token
  }
  isSupportedToken() {
    return this.symbol && this.digits
  }
  getUnitAmount(amount){
    amount = amount || 0;
    if(this.isSupportedToken()) {
      return toUnitAmount(amount,this.digits)
    } else {
      return toBig(0)
    }
  }
  getDecimalsAmount(amount){
   return toDecimalsAmount(amount,this.digits)
  }
  getUnitAmountValue(amount,price){
    const unitAmount = this.getUnitAmount(amount);
    return unitAmount.times(toBig(price))
  }

  toPricisionFixed(amount,ceil){
   return toFixed(amount,this.precision,ceil)
  }
  toFormatLength(amount,ceil){
   return formatLength(amount,ceil)
  }
  shorterPrecision(amount, precision) {
    return precisionShorter(amount, precision)
  }
}

const precisionShorter = (value, precision) => {
  const p = precision === undefined ? 8 : precision
  if(isNaN(value)) return toFixed(0, p);
  const x = toBig(value)
  if(x.lt(99)) {
    return toFixed(x, p);
  }
  if(x.lt(9999)) {
    return toFixed(x, 4);
  }
  return toFixed(x, 0);
}

export function getBalanceBySymbol({balances, symbol, toUnit}) {
  let tokenAssets = balances.find(item => item.symbol.toLowerCase() === symbol.toLowerCase()) || {
    balance: toBig(0),
    allowance: toBig(0)
  };
  const tokenFormatter = new TokenFm({symbol: symbol});
  if(tokenFormatter.isSupportedToken()) {
    if (toUnit) {
      const balance = tokenFormatter.getUnitAmount(tokenAssets.balance);
      const allowance = tokenFormatter.getUnitAmount(tokenAssets.allowance);
      tokenAssets = {...tokenAssets, balance, allowance}
    } else {
      const balance = toBig(tokenAssets.balance);
      const allowance = toBig(tokenAssets.allowance);
      tokenAssets = {...tokenAssets, balance, allowance}
    }
  } else {
    tokenAssets = {...tokenAssets, balance:toBig(0), allowance:toBig(0)}
  }
  return {...tokenAssets}
}

export function getPriceBySymbol({prices, symbol, ifFormat}) {
  let priceToken = prices.find(item => item.symbol.toLowerCase() === symbol.toLowerCase()) || {price: 0}
  if (ifFormat) {
    if (priceToken) {
      const price = Number(priceToken.price)
      // fix bug: price == string
      if (price && typeof price === 'number') {
        priceToken.price = price
      } else {
        priceToken.price = 0
      }
      return {...priceToken}
    } else {
      return {
        price: 0,
      }
    }
  } else {
    return {...priceToken}
  }
}

export function getWorthBySymbol({prices, symbol, ifFormat, amount}) {
  const price = getPriceBySymbol({prices, symbol, ifFormat});
  if(price.price) {
    return toFixed(toBig(price.price).times(toBig(amount)),2)
  }
}

export function validateEthAddress(value) {
  try {
    validator.validate({value: value, type: 'ETH_ADDRESS'})
    return true;
  } catch (e) {
    return false;
  }
}

export const sorter = (tokenA,tokenB)=>{
  const pa = Number(tokenA.balance);
  const pb = Number(tokenB.balance);
  if(pa === pb){
    return tokenA.symbol.toUpperCase() < tokenB.symbol.toUpperCase() ? -1 : 1;
  }else {
    return pb - pa;
  }
};

const integerReg = new RegExp("^[0-9]*$")
const numberReg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*)|(0))$")

export function isValidNumber(number) {
  const reg =  new RegExp("^([0-9]+\\.?[0-9]*)$")
  return reg.test(number)
}

export function isValidInteger(int) {
  return int && integerReg.test(int)
}
