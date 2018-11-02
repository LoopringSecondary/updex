import {toNumber} from "LoopringJS/common/formatter";
import validator from 'LoopringJS/ethereum/validator';

const storeUnlockedAddress = (unlockType, address) => {
  localStorage.unlockedType = unlockType;
  localStorage.unlockedAddress = address
};

const getUnlockedAddress = () => {
  return localStorage.unlockedAddress || ''
};

const getUnlockedType = () => {
  return localStorage.unlockedType || ''
};

const clearUnlockedAddress = () => {
  localStorage.unlockedType = ''
  localStorage.unlockedAddress = ''
};

const setRewardAddress = (address) => {
  localStorage.rewardAddress =  address;
};

const getRewardAddress = () => {
  return  localStorage.rewardAddress
};

export default {
  storeUnlockedAddress,
  getUnlockedAddress,
  getUnlockedType,
  clearUnlockedAddress,
  setRewardAddress,
  getRewardAddress
}

