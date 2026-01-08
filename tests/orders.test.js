const request = require('supertest');
const app = require('../src/app');

const AUTH_TOKEN = 'mock-token-bajaj-2024';

describe('Orders API', () => {
  
  describe('POST /api/v1/orders', () => {
    it('should place a MARKET BUY order successfully', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .send({
          symbol: 'SBIN',
          orderType: 'BUY',
          orderStyle: 'MARKET',
          quantity: 2
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.order.status).toBe('EXECUTED');
      expect(res.body.data.order.symbol).toBe('SBIN');
      expect(res.body.data.order.filledQuantity).toBe(2);
    });

    it('should place a LIMIT order with PLACED status', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .send({
          symbol: 'TCS',
          orderType: 'BUY',
          orderStyle: 'LIMIT',
          quantity: 1,
          price: 3800
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.data.order.status).toBe('PLACED');
      expect(res.body.data.order.orderStyle).toBe('LIMIT');
    });

    it('should return 400 for missing symbol', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .send({
          orderType: 'BUY',
          orderStyle: 'MARKET',
          quantity: 5
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid quantity', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .send({
          symbol: 'SBIN',
          orderType: 'BUY',
          orderStyle: 'MARKET',
          quantity: -5
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error.message).toContain('Quantity');
    });

    it('should return 400 for LIMIT order without price', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .send({
          symbol: 'SBIN',
          orderType: 'BUY',
          orderStyle: 'LIMIT',
          quantity: 5
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error.message).toContain('Price');
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .send({
          symbol: 'SBIN',
          orderType: 'BUY',
          orderStyle: 'MARKET',
          quantity: 5
        });
      
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/v1/orders', () => {
    it('should return orders for authenticated user', async () => {
      const res = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.orders)).toBe(true);
    });
  });
});
