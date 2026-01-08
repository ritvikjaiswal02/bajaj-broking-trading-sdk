# Bajaj Broking Trading SDK

A simplified Trading API SDK for stock broking operations built with Node.js and Express.

## 👤 Author

| Field | Details |
|-------|---------|
| **Name** | Ritvik Rajendrakumar Jaiswal |
| **Roll Number** | 229301143 |
| **University** | Manipal University Jaipur |

---

## 📋 Overview

This project implements a wrapper SDK around simplified Trading APIs that allows users to:

- ✅ View available financial instruments
- ✅ Place buy and sell orders (MARKET & LIMIT)
- ✅ Check order status
- ✅ View executed trades
- ✅ Fetch portfolio holdings with P&L calculations

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | In-memory (JavaScript Map) |
| Authentication | Mock Bearer Token |
| API Format | JSON |

---

## 📁 Project Structure

```
bajaj-trading-api/
├── src/
│   ├── data/
│   │   └── store.js          # In-memory data store & helper functions
│   ├── middleware/
│   │   ├── auth.js           # Mock authentication middleware
│   │   └── errorHandler.js   # Centralized error handling
│   ├── routes/
│   │   ├── instruments.js    # Instrument APIs
│   │   ├── orders.js         # Order management APIs
│   │   ├── trades.js         # Trade APIs
│   │   └── portfolio.js      # Portfolio APIs
│   └── app.js                # Express app configuration
├── server.js                 # Entry point
├── package.json
├── .env
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation Steps

```bash
# 1. Clone or extract the project
cd bajaj-trading-api

# 2. Install dependencies
npm install

# 3. Create .env file (if not exists)
echo "PORT=3000" > .env
echo "AUTH_TOKEN=mock-token-bajaj-2024" >> .env

# 4. Start the server
npm start
```

### Server Output

```
🚀 Bajaj Trading API running on http://localhost:3000
📚 Endpoints: /api/v1/instruments, /api/v1/orders, /api/v1/trades, /api/v1/portfolio
🔑 Auth Token: mock-token-bajaj-2024
```

---

## 🔐 Authentication

All endpoints except `/api/v1/instruments` require authentication.

| Header | Value |
|--------|-------|
| Authorization | `Bearer mock-token-bajaj-2024` |

**Example:**
```
Authorization: Bearer mock-token-bajaj-2024
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

---

### 1. Instrument APIs

#### GET /instruments
Fetch all tradable instruments.

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "data": {
    "instruments": [
      {
        "id": "INS001",
        "symbol": "RELIANCE",
        "exchange": "NSE",
        "instrumentType": "EQUITY",
        "lastTradedPrice": 2450.5
      }
    ],
    "count": 10
  }
}
```

#### GET /instruments/:id
Fetch single instrument by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "instrument": {
      "id": "INS001",
      "symbol": "RELIANCE",
      "exchange": "NSE",
      "instrumentType": "EQUITY",
      "lastTradedPrice": 2450.5
    }
  }
}
```

---

### 2. Order Management APIs

#### POST /orders
Place a new order.

**Authentication:** Required

**Request Body:**
```json
{
  "symbol": "SBIN",
  "orderType": "BUY",
  "orderStyle": "MARKET",
  "quantity": 5
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| symbol | string | Yes | Stock symbol (e.g., RELIANCE, TCS) |
| orderType | string | Yes | BUY or SELL |
| orderStyle | string | Yes | MARKET or LIMIT |
| quantity | integer | Yes | Must be > 0 |
| price | number | For LIMIT | Required for LIMIT orders |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order": {
      "orderId": "ORD17365432001234",
      "userId": "USER001",
      "symbol": "SBIN",
      "exchange": "NSE",
      "orderType": "BUY",
      "orderStyle": "MARKET",
      "quantity": 5,
      "price": null,
      "status": "EXECUTED",
      "filledQuantity": 5,
      "averageFilledPrice": 825.4,
      "createdAt": "2024-01-10T10:30:00.000Z"
    }
  }
}
```

#### GET /orders
Fetch all orders for user.

**Authentication:** Required

**Query Parameters:**
- `status` (optional): Filter by status (NEW, PLACED, EXECUTED, CANCELLED)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "count": 5
  }
}
```

#### GET /orders/:orderId
Fetch single order by ID.

**Authentication:** Required

---

### 3. Trade APIs

#### GET /trades
Fetch all executed trades for user.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "trades": [
      {
        "tradeId": "TRD17365432005678",
        "orderId": "ORD17365432001234",
        "userId": "USER001",
        "symbol": "SBIN",
        "exchange": "NSE",
        "transactionType": "BUY",
        "quantity": 5,
        "price": 825.4,
        "timestamp": "2024-01-10T10:30:00.000Z"
      }
    ],
    "count": 1
  }
}
```

#### GET /trades/:tradeId
Fetch single trade by ID.

**Authentication:** Required

---

### 4. Portfolio APIs

#### GET /portfolio
Fetch portfolio holdings with P&L calculations.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "holdings": [
      {
        "symbol": "RELIANCE",
        "quantity": 10,
        "averagePrice": 2400,
        "currentPrice": 2450.5,
        "currentValue": 24505,
        "investedValue": 24000,
        "profitLoss": 505,
        "profitLossPercentage": 2.1
      }
    ],
    "summary": {
      "totalInvestment": 75000,
      "totalCurrentValue": 78500,
      "totalProfitLoss": 3500,
      "totalProfitLossPercentage": 4.67
    }
  }
}
```

#### GET /portfolio/:symbol
Fetch specific holding by symbol.

**Authentication:** Required

---

## ❌ Error Handling

All errors follow consistent format:

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Quantity must be a positive integer"
  }
}
```

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Validation errors |
| 401 | Unauthorized - Invalid/missing token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## 🧪 Sample API Usage (cURL)

### Get All Instruments
```bash
curl http://localhost:3000/api/v1/instruments
```

### Get Portfolio
```bash
curl http://localhost:3000/api/v1/portfolio \
  -H "Authorization: Bearer mock-token-bajaj-2024"
```

### Place BUY Order (MARKET)
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mock-token-bajaj-2024" \
  -d '{"symbol":"SBIN","orderType":"BUY","orderStyle":"MARKET","quantity":5}'
```

### Place SELL Order
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mock-token-bajaj-2024" \
  -d '{"symbol":"RELIANCE","orderType":"SELL","orderStyle":"MARKET","quantity":3}'
```

### Place LIMIT Order
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mock-token-bajaj-2024" \
  -d '{"symbol":"TCS","orderType":"BUY","orderStyle":"LIMIT","quantity":2,"price":3800}'
```

### Get All Orders
```bash
curl http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer mock-token-bajaj-2024"
```

### Get All Trades
```bash
curl http://localhost:3000/api/v1/trades \
  -H "Authorization: Bearer mock-token-bajaj-2024"
```

---

## 📌 Assumptions

1. **Single User System**: Mock authentication with hardcoded user (USER001) and token
2. **In-Memory Storage**: All data stored in JavaScript Maps; resets on server restart
3. **Market Order Execution**: MARKET orders execute immediately at `lastTradedPrice`
4. **Limit Order Behavior**: LIMIT orders remain in `PLACED` status (no price matching simulation)
5. **Portfolio Initialization**: User starts with 3 holdings (RELIANCE, TCS, INFY)
6. **Sell Validation**: SELL orders validate sufficient holdings before execution
7. **Average Price Calculation**: On BUY, average price is recalculated; on SELL, it remains unchanged
8. **All Prices in INR**: No currency conversion

---

## ✅ Features Implemented

| Requirement | Status |
|-------------|--------|
| Instrument APIs | ✅ Complete |
| Order Placement (BUY/SELL) | ✅ Complete |
| Order Types (MARKET/LIMIT) | ✅ Complete |
| Order Status Tracking | ✅ Complete |
| Trade History | ✅ Complete |
| Portfolio with P&L | ✅ Complete |
| Input Validations | ✅ Complete |
| Error Handling | ✅ Complete |
| Mock Authentication | ✅ Complete |
| RESTful Design | ✅ Complete |

---

## 🎯 Bonus Features

| Feature | Status |
|---------|--------|
| Centralized Error Handling | ✅ Implemented |
| Market Order Auto-Execution | ✅ Implemented |
| P&L Calculations | ✅ Implemented |
| Holdings Validation for SELL | ✅ Implemented |

---

## 📞 Support

For any queries regarding this implementation, please contact:

**Ritvik Rajendrakumar Jaiswal**  
Roll Number: 229301143  
Manipal University Jaipur

---

*Built for Bajaj Broking Campus Hiring Assignment*