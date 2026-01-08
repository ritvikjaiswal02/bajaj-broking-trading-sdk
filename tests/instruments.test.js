const request = require('supertest');
const app = require('../src/app');

describe('Instruments API', () => {
  
  describe('GET /api/v1/instruments', () => {
    it('should return all instruments', async () => {
      const res = await request(app)
        .get('/api/v1/instruments');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.instruments).toBeDefined();
      expect(res.body.data.count).toBe(10);
      expect(Array.isArray(res.body.data.instruments)).toBe(true);
    });

    it('should return instruments with correct fields', async () => {
      const res = await request(app)
        .get('/api/v1/instruments');
      
      const instrument = res.body.data.instruments[0];
      expect(instrument).toHaveProperty('id');
      expect(instrument).toHaveProperty('symbol');
      expect(instrument).toHaveProperty('exchange');
      expect(instrument).toHaveProperty('instrumentType');
      expect(instrument).toHaveProperty('lastTradedPrice');
    });
  });

  describe('GET /api/v1/instruments/:id', () => {
    it('should return instrument by ID', async () => {
      const res = await request(app)
        .get('/api/v1/instruments/INS001');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.instrument.symbol).toBe('RELIANCE');
    });

    it('should return 404 for invalid ID', async () => {
      const res = await request(app)
        .get('/api/v1/instruments/INVALID123');
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe(404);
    });
  });
});
