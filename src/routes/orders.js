const express = require('express');
const router = express.Router();
const store = require('../data/store');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         orderId:
 *           type: string
 *           example: ORD17365432001234
 *         userId:
 *           type: string
 *           example: USER001
 *         symbol:
 *           type: string
 *           example: RELIANCE
 *         exchange:
 *           type: string
 *           example: NSE
 *         orderType:
 *           type: string
 *           enum: [BUY, SELL]
 *         orderStyle:
 *           type: string
 *           enum: [MARKET, LIMIT]
 *         quantity:
 *           type: integer
 *           example: 10
 *         price:
 *           type: number
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [NEW, PLACED, EXECUTED, CANCELLED]
 *         filledQuantity:
 *           type: integer
 *         averageFilledPrice:
 *           type: number
 *     OrderRequest:
 *       type: object
 *       required:
 *         - symbol
 *         - orderType
 *         - orderStyle
 *         - quantity
 *       properties:
 *         symbol:
 *           type: string
 *           example: SBIN
 *         orderType:
 *           type: string
 *           enum: [BUY, SELL]
 *           example: BUY
 *         orderStyle:
 *           type: string
 *           enum: [MARKET, LIMIT]
 *           example: MARKET
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *         price:
 *           type: number
 *           description: Required for LIMIT orders
 *           example: 850.00
 */

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderRequest'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all orders for user
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [NEW, PLACED, EXECUTED, CANCELLED]
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/orders/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
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

    logger.info('Order request received', { userId, symbol, orderType, orderStyle, quantity });

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
    logger.info('Order created', { orderId, status: 'PLACED' });

    // 3. Execution Logic (MARKET Orders)
    if (orderStyle === 'MARKET') {
      const executionPrice = instrument.lastTradedPrice;
      
      // Update Order
      store.updateOrderStatus(orderId, 'EXECUTED', quantity, executionPrice);
      logger.info('Order executed', { orderId, executionPrice, quantity });

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
      logger.info('Trade created', { tradeId, orderId, symbol, quantity, price: executionPrice });

      // Update Portfolio
      store.updatePortfolio(userId, instrument.symbol, quantity, executionPrice, orderType === 'BUY');
      logger.info('Portfolio updated', { userId, symbol, quantity, action: orderType });
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
    logger.error('Order placement failed', { error: error.message, userId: req.userId });
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
