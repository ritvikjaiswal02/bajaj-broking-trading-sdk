const INSTRUMENTS = [
  { id: "INS001", symbol: "RELIANCE", exchange: "NSE", instrumentType: "EQUITY", lastTradedPrice: 2450.50 },
  { id: "INS002", symbol: "TCS", exchange: "NSE", instrumentType: "EQUITY", lastTradedPrice: 3890.75 },
  { id: "INS003", symbol: "INFY", exchange: "NSE", instrumentType: "EQUITY", lastTradedPrice: 1567.25 },
  { id: "INS004", symbol: "HDFCBANK", exchange: "NSE", instrumentType: "EQUITY", lastTradedPrice: 1678.00 },
  { id: "INS005", symbol: "ICICIBANK", exchange: "NSE", instrumentType: "EQUITY", lastTradedPrice: 1245.30 },
  { id: "INS006", symbol: "SBIN", exchange: "NSE", instrumentType: "EQUITY", lastTradedPrice: 825.40 },
  { id: "INS007", symbol: "BHARTIARTL", exchange: "NSE", instrumentType: "EQUITY", lastTradedPrice: 1456.80 },
  { id: "INS008", symbol: "ITC", exchange: "NSE", instrumentType: "EQUITY", lastTradedPrice: 465.25 },
  { id: "INS009", symbol: "KOTAKBANK", exchange: "BSE", instrumentType: "EQUITY", lastTradedPrice: 1789.50 },
  { id: "INS010", symbol: "LT", exchange: "BSE", instrumentType: "EQUITY", lastTradedPrice: 3456.00 }
];

// Data Stores
const orders = new Map();
const trades = new Map();
const portfolio = new Map();

// Initial User Holdings
portfolio.set("USER001", [
  { symbol: "RELIANCE", quantity: 10, averagePrice: 2400.00 },
  { symbol: "TCS", quantity: 5, averagePrice: 3800.00 },
  { symbol: "INFY", quantity: 15, averagePrice: 1500.00 }
]);

// Helper Functions
const generateOrderId = () => "ORD" + Date.now() + Math.floor(1000 + Math.random() * 9000);
const generateTradeId = () => "TRD" + Date.now() + Math.floor(1000 + Math.random() * 9000);

const getInstruments = () => INSTRUMENTS;

const getInstrumentBySymbol = (symbol) => {
  return INSTRUMENTS.find(i => i.symbol.toUpperCase() === symbol.toUpperCase());
};

const getInstrumentById = (id) => {
  return INSTRUMENTS.find(i => i.id === id);
};

const createOrder = (orderData) => {
  orders.set(orderData.orderId, orderData);
  return orderData;
};

const getOrderById = (orderId) => {
  return orders.get(orderId) || null;
};

const getOrdersByUser = (userId) => {
  const userOrders = [];
  for (const order of orders.values()) {
    if (order.userId === userId) {
      userOrders.push(order);
    }
  }
  return userOrders;
};

const updateOrderStatus = (orderId, status, filledQuantity, filledPrice) => {
  const order = orders.get(orderId);
  if (order) {
    order.status = status;
    if (filledQuantity !== undefined) order.filledQuantity = filledQuantity;
    if (filledPrice !== undefined) order.averageFilledPrice = filledPrice;
    orders.set(orderId, order);
  }
  return order;
};

const createTrade = (tradeData) => {
  trades.set(tradeData.tradeId, tradeData);
  return tradeData;
};

const getTradesByUser = (userId) => {
  const userTrades = [];
  for (const trade of trades.values()) {
    if (trade.userId === userId) {
      userTrades.push(trade);
    }
  }
  return userTrades;
};

const getPortfolio = (userId) => {
  return portfolio.get(userId) || [];
};

const updatePortfolio = (userId, symbol, quantity, price, isBuy) => {
  let holdings = portfolio.get(userId) || [];
  let holding = holdings.find(h => h.symbol === symbol);

  if (isBuy) {
    if (holding) {
      // Calculate new average price: (Total Value + New Value) / Total Quantity
      const totalValue = (holding.quantity * holding.averagePrice) + (quantity * price);
      const totalQuantity = holding.quantity + quantity;
      holding.averagePrice = totalValue / totalQuantity;
      holding.quantity = totalQuantity;
    } else {
      // New holding
      holdings.push({
        symbol: symbol,
        quantity: quantity,
        averagePrice: price
      });
    }
  } else {
    // SELL
    if (holding) {
      holding.quantity -= quantity;
      // Average price remains UNCHANGED on sell
      if (holding.quantity <= 0) {
        // Remove holding if quantity is 0 or less
        holdings = holdings.filter(h => h.symbol !== symbol);
      }
    }
  }
  
  portfolio.set(userId, holdings);
  return holdings;
};

module.exports = {
  getInstruments,
  getInstrumentBySymbol,
  getInstrumentById,
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  createTrade,
  getTradesByUser,
  getPortfolio,
  updatePortfolio,
  generateOrderId,
  generateTradeId
};
