const express = require('express');
const router = express.Router();
const store = require('../data/store');
const auth = require('../middleware/auth');

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
