const request = require('supertest');
const app = require('../src/app');

const AUTH_TOKEN = 'mock-token-bajaj-2024';

describe('Trades API', () => {
  
  describe('GET /api/v1/trades', () => {
    it('should return trades for authenticated user', async () => {
      const res = await request(app)
        .get('/api/v1/trades')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.trades)).toBe(true);
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .get('/api/v1/trades');
      
      expect(res.statusCode).toBe(401);
    });
  });
});
