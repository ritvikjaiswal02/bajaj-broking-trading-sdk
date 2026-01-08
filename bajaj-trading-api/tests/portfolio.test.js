const request = require('supertest');
const app = require('../src/app');

const AUTH_TOKEN = 'mock-token-bajaj-2024';

describe('Portfolio API', () => {
  
  describe('GET /api/v1/portfolio', () => {
    it('should return portfolio with holdings', async () => {
      const res = await request(app)
        .get('/api/v1/portfolio')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.holdings).toBeDefined();
      expect(res.body.data.summary).toBeDefined();
    });

    it('should return holdings with P&L calculations', async () => {
      const res = await request(app)
        .get('/api/v1/portfolio')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`);
      
      const holding = res.body.data.holdings[0];
      expect(holding).toHaveProperty('symbol');
      expect(holding).toHaveProperty('quantity');
      expect(holding).toHaveProperty('averagePrice');
      expect(holding).toHaveProperty('currentPrice');
      expect(holding).toHaveProperty('currentValue');
      expect(holding).toHaveProperty('profitLoss');
      expect(holding).toHaveProperty('profitLossPercentage');
    });

    it('should return portfolio summary', async () => {
      const res = await request(app)
        .get('/api/v1/portfolio')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`);
      
      const summary = res.body.data.summary;
      expect(summary).toHaveProperty('totalInvestment');
      expect(summary).toHaveProperty('totalCurrentValue');
      expect(summary).toHaveProperty('totalProfitLoss');
      expect(summary).toHaveProperty('totalProfitLossPercentage');
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .get('/api/v1/portfolio');
      
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/v1/portfolio/:symbol', () => {
    it('should return specific holding', async () => {
      const res = await request(app)
        .get('/api/v1/portfolio/RELIANCE')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.data.holding.symbol).toBe('RELIANCE');
    });

    it('should return 404 for non-existent holding', async () => {
      const res = await request(app)
        .get('/api/v1/portfolio/NONEXISTENT')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`);
      
      expect(res.statusCode).toBe(404);
    });
  });
});
