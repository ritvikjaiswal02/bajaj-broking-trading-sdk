const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET / - Get all instruments
router.get('/', (req, res) => {
  const instruments = store.getInstruments();
  res.json({
    success: true,
    data: {
      instruments: instruments,
      count: instruments.length
    }
  });
});

// GET /:id - Get instrument by ID
router.get('/:id', (req, res) => {
  const instrument = store.getInstrumentById(req.params.id);
  
  if (!instrument) {
    return res.status(404).json({
      success: false,
      error: {
        code: 404,
        message: "Instrument not found"
      }
    });
  }

  res.json({
    success: true,
    data: {
      instrument: instrument
    }
  });
});

module.exports = router;
