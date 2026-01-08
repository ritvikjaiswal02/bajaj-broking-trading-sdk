const express = require('express');
const router = express.Router();
const store = require('../data/store');
const auth = require('../middleware/auth');

router.use(auth);

// POST / - Place new order
router.post('/', (req, res) => {
  try {
    const { symbol, orderType, orderStyle, quantity, price } = req.body;
    const userId = req.userId;

    // 1. Validations
    if (!symbol) return res.status(400).json({ success: false, error: { code: 400, message: "Symbol is required" } });
    
    const instrument = store.getInstrumentBySymbol(symbol);
    if (!instrument) {
      return res.status(400).json({ success: false, error: { code: 400, message: "Invalid symbol" } });
    }

    if (!orderType || !['BUY', 'SELL'].includes(orderType.toUpperCase())) {
      return res.status(400).json({ success: false, error: { code: 400, message: "Invalid orderType. Must be BUY or SELL" } });
    }

    if (!orderStyle || !['MARKET', 'LIMIT'].includes(orderStyle.toUpperCase())) {
      return res.status(400).json({ success: false, error: { code: 400, message: "Invalid orderStyle. Must be MARKET or LIMIT" } });
    }

    if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ success: false, error: { code: 400, message: "Quantity must be a positive integer" } });
    }

    if (orderStyle === 'LIMIT' && (!price || price <= 0)) {
      return res.status(400).json({ success: false, error: { code: 400, message: "Price is required for LIMIT orders and must be positive" } });
    }

    // Check holdings for SELL orders
    if (orderType === 'SELL') {
      const portfolio = store.getPortfolio(userId);
      const holding = portfolio.find(h => h.symbol === instrument.symbol);
      if (!holding || holding.quantity < quantity) {
        return res.status(400).json({ success: false, error: { code: 400, message: "Insufficient holdings for SELL order" } });
      }
    }

    // 2. Create Order Object
    const orderId = store.generateOrderId();
    const newOrder = {
      orderId,
      userId,
      symbol: instrument.symbol,
      exchange: instrument.exchange,
      orderType,
      orderStyle,
      quantity,
      price: orderStyle === 'LIMIT' ? price : null,
      status: 'NEW', // Initial status
      filledQuantity: 0,
      averageFilledPrice: 0,
      createdAt: new Date()
    };

    // Save initial order
    store.createOrder(newOrder);
    store.updateOrderStatus(orderId, 'PLACED'); // Immediately set to PLACED per requirements

    // 3. Execution Logic (MARKET Orders)
    if (orderStyle === 'MARKET') {
      const executionPrice = instrument.lastTradedPrice;
      
      // Update Order
      store.updateOrderStatus(orderId, 'EXECUTED', quantity, executionPrice);

      // Create Trade
      const tradeId = store.generateTradeId();
      const trade = {
        tradeId,
        orderId,
        userId,
        symbol: instrument.symbol,
        exchange: instrument.exchange,
        transactionType: orderType,
        quantity,
        price: executionPrice,
        timestamp: new Date()
      };
      store.createTrade(trade);

      // Update Portfolio
      store.updatePortfolio(userId, instrument.symbol, quantity, executionPrice, orderType === 'BUY');
    }

    // 4. Response
    // Refetch order to get latest state
    const placedOrder = store.getOrderById(orderId);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        order: placedOrder
      }
    });

  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, error: { code: 500, message: "Internal Server Error" } });
  }
});

// GET / - Get all orders for user
router.get('/', (req, res) => {
  const userId = req.userId;
  const statusFilter = req.query.status;
  
  let orders = store.getOrdersByUser(userId);

  if (statusFilter) {
    orders = orders.filter(o => o.status === statusFilter);
  }

  res.json({
    success: true,
    data: {
      orders: orders,
      count: orders.length
    }
  });
});

// GET /:orderId - Get single order
router.get('/:orderId', (req, res) => {
  const order = store.getOrderById(req.params.orderId);

  if (!order || order.userId !== req.userId) {
    return res.status(404).json({
      success: false,
      error: {
        code: 404,
        message: "Order not found"
      }
    });
  }

  res.json({
    success: true,
    data: {
      order: order
    }
  });
});

module.exports = router;
