
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

const setLoopringUnlockWith = (unlock) => {
  localStorage.loopringUnlockWith = unlock
}

const getLoopringUnlockWith = () => {
  return localStorage.loopringUnlockWith
}

export default {
  storeUnlockedAddress,
  getUnlockedAddress,
  getUnlockedType,
  clearUnlockedAddress,
  setLoopringUnlockWith,
  getLoopringUnlockWith
}

