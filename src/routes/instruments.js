const express = require('express');
const router = express.Router();
const store = require('../data/store');
const logger = require('../utils/logger');

/**
 * @swagger
 * components:
 *   schemas:
 *     Instrument:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: INS001
 *         symbol:
 *           type: string
 *           example: RELIANCE
 *         exchange:
 *           type: string
 *           enum: [NSE, BSE]
 *           example: NSE
 *         instrumentType:
 *           type: string
 *           example: EQUITY
 *         lastTradedPrice:
 *           type: number
 *           example: 2450.50
 */

/**
 * @swagger
 * /api/v1/instruments:
 *   get:
 *     summary: Get all tradable instruments
 *     tags: [Instruments]
 *     responses:
 *       200:
 *         description: List of all instruments
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
 *                     instruments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Instrument'
 *                     count:
 *                       type: integer
 */
router.get('/', (req, res) => {
  const instruments = store.getInstruments();
  logger.info('Instruments fetched', { count: instruments.length });
  res.json({
    success: true,
    data: {
      instruments: instruments,
      count: instruments.length
    }
  });
});

/**
 * @swagger
 * /api/v1/instruments/{id}:
 *   get:
 *     summary: Get instrument by ID
 *     tags: [Instruments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: INS001
 *     responses:
 *       200:
 *         description: Instrument details
 *       404:
 *         description: Instrument not found
 */
router.get('/:id', (req, res) => {
  const instrument = store.getInstrumentById(req.params.id);
  logger.info('Instrument fetched', { id: req.params.id, found: !!instrument });
  
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
