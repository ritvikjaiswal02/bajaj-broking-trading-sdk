const express = require('express');
const router = express.Router();
const store = require('../data/store');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

/**
 * @swagger
 * components:
 *   schemas:
 *     Trade:
 *       type: object
 *       properties:
 *         tradeId:
 *           type: string
 *           example: TRD17365432005678
 *         orderId:
 *           type: string
 *         userId:
 *           type: string
 *         symbol:
 *           type: string
 *         exchange:
 *           type: string
 *         transactionType:
 *           type: string
 *           enum: [BUY, SELL]
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *         timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/trades:
 *   get:
 *     summary: Get all trades for user
 *     tags: [Trades]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of executed trades
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/trades/{tradeId}:
 *   get:
 *     summary: Get trade by ID
 *     tags: [Trades]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trade details
 *       404:
 *         description: Trade not found
 */
router.use(auth);

// GET / - Get all trades for user
router.get('/', (req, res) => {
  const trades = store.getTradesByUser(req.userId);
  logger.info('Trades fetched', { userId: req.userId, count: trades.length });
  
  res.json({
    success: true,
    data: {
      trades: trades,
      count: trades.length
    }
  });
});

// GET /:tradeId - Get trade by ID
router.get('/:tradeId', (req, res) => {
  // Currently store doesn't have getTradeById but we can implement finding it or just iterate user trades
  // Ideally store should have it, but for now I'll use the trades map directly via helper if I added it?
  // I didn't add getTradeById to store.js exports explicitly in logic above, 
  // but I can use getTradesByUser and find it there for safety/correctness
  
  // Correction: I should probably just access the map in store if I could, but store.js encapsulates it.
  // I'll fetch all user trades and find it. 
  
  const trades = store.getTradesByUser(req.userId);
  const trade = trades.find(t => t.tradeId === req.params.tradeId);

  if (!trade) {
    return res.status(404).json({
      success: false,
      error: {
        code: 404,
        message: "Trade not found"
      }
    });
  }

  res.json({
    success: true,
    data: {
      trade: trade
    }
  });
});

module.exports = router;
