const express = require('express');
const router = express.Router();
const store = require('../data/store');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

/**
 * @swagger
 * components:
 *   schemas:
 *     Holding:
 *       type: object
 *       properties:
 *         symbol:
 *           type: string
 *           example: RELIANCE
 *         quantity:
 *           type: integer
 *           example: 10
 *         averagePrice:
 *           type: number
 *           example: 2400.00
 *         currentPrice:
 *           type: number
 *           example: 2450.50
 *         currentValue:
 *           type: number
 *           example: 24505.00
 *         investedValue:
 *           type: number
 *           example: 24000.00
 *         profitLoss:
 *           type: number
 *           example: 505.00
 *         profitLossPercentage:
 *           type: number
 *           example: 2.10
 *     PortfolioSummary:
 *       type: object
 *       properties:
 *         totalInvestment:
 *           type: number
 *         totalCurrentValue:
 *           type: number
 *         totalProfitLoss:
 *           type: number
 *         totalProfitLossPercentage:
 *           type: number
 */

/**
 * @swagger
 * /api/v1/portfolio:
 *   get:
 *     summary: Get portfolio holdings with P&L
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Portfolio with holdings and summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     holdings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Holding'
 *                     summary:
 *                       $ref: '#/components/schemas/PortfolioSummary'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/portfolio/{symbol}:
 *   get:
 *     summary: Get specific holding by symbol
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         example: RELIANCE
 *     responses:
 *       200:
 *         description: Holding details
 *       404:
 *         description: Holding not found
 */
router.use(auth);

// Helper to calculate P&L for a holding
const calculateHoldingStats = (holding) => {
  const instrument = store.getInstrumentBySymbol(holding.symbol);
  // Fallback if instrument somehow missing (shouldn't happen)
  const currentPrice = instrument ? instrument.lastTradedPrice : holding.averagePrice;
  
  const currentValue = holding.quantity * currentPrice;
  const investedValue = holding.quantity * holding.averagePrice;
  const profitLoss = currentValue - investedValue;
  const profitLossPercentage = investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;

  return {
    ...holding,
    currentPrice,
    currentValue,
    investedValue,
    profitLoss,
    profitLossPercentage: parseFloat(profitLossPercentage.toFixed(2)) // Rounding for display
  };
};

// GET / - Get portfolio summary
router.get('/', (req, res) => {
  const rawHoldings = store.getPortfolio(req.userId);
  logger.info('Portfolio fetched', { userId: req.userId, holdingsCount: rawHoldings.length });
  
  const enrichedHoldings = rawHoldings.map(calculateHoldingStats);

  // Summary
  const summary = enrichedHoldings.reduce((acc, curr) => {
    acc.totalInvestment += curr.investedValue;
    acc.totalCurrentValue += curr.currentValue;
    acc.totalProfitLoss += curr.profitLoss;
    return acc;
  }, { totalInvestment: 0, totalCurrentValue: 0, totalProfitLoss: 0 });

  summary.totalProfitLossPercentage = summary.totalInvestment > 0 
    ? (summary.totalProfitLoss / summary.totalInvestment) * 100 
    : 0;
    
  // Formatting summary numbers if needed, but keeping raw numbers is often better for APIs
  // Just rounding percentage
  summary.totalProfitLossPercentage = parseFloat(summary.totalProfitLossPercentage.toFixed(2));

  res.json({
    success: true,
    data: {
      holdings: enrichedHoldings,
      summary: summary
    }
  });
});

// GET /:symbol - Get specific holding
router.get('/:symbol', (req, res) => {
  const rawHoldings = store.getPortfolio(req.userId);
  const holding = rawHoldings.find(h => h.symbol.toUpperCase() === req.params.symbol.toUpperCase());

  if (!holding) {
    return res.status(404).json({
      success: false,
      error: {
        code: 404,
        message: "Holding not found for this symbol"
      }
    });
  }

  const enrichedHolding = calculateHoldingStats(holding);

  res.json({
    success: true,
    data: {
      holding: enrichedHolding
    }
  });
});

module.exports = router;
