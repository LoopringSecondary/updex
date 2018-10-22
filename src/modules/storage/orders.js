const storeP2POrder = (order) => {
  const p2pOrders = localStorage.p2pOrders ? JSON.parse(localStorage.p2pOrders) : []
  p2pOrders.push(order)
  localStorage.p2pOrders = JSON.stringify(p2pOrders)
}

const getP2POrder = (hash) => {
  const p2pOrders = localStorage.p2pOrders ? JSON.parse(localStorage.p2pOrders) : []
  return p2pOrders.find(order=> order.Hash === hash)
}

const deleteP2POrder = (hash) => {
  const p2pOrders = localStorage.p2pOrders ? JSON.parse(localStorage.p2pOrders) : []
  const orders =  p2pOrders.filter(order => order.Hash !== hash)
  localStorage.p2pOrders = JSON.stringify(orders)
}

export default {
  storeP2POrder,
  getP2POrder,
  deleteP2POrder
}
