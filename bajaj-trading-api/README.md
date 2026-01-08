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
| Documentation | Swagger / OpenAPI 3.0 |
| Testing | Jest + Supertest |

---

## 📁 Project Structure

```
bajaj-trading-api/
├── src/
│   ├── config/
│   │   └── swagger.js        # Swagger/OpenAPI configuration
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
│   ├── utils/
│   │   └── logger.js         # Custom logging utility
│   └── app.js                # Express app configuration
├── tests/
│   ├── instruments.test.js   # Instrument API tests
│   ├── orders.test.js        # Order API tests
│   ├── portfolio.test.js     # Portfolio API tests
│   └── trades.test.js        # Trade API tests
├── server.js                 # Entry point
├── package.json
├── .env.example
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
# 1. Clone the repository
git clone https://github.com/ritvikjaiswal02/bajaj-broking-trading-sdk.git
cd bajaj-broking-trading-sdk

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Or manually create with:
# PORT=3000
# AUTH_TOKEN=mock-token-bajaj-2024

# 4. Start the server
npm start

# 5. Run tests
npm test
```

### Server Output

```
🚀 Bajaj Trading API running on http://localhost:3000
📚 Endpoints: /api/v1/instruments, /api/v1/orders, /api/v1/trades, /api/v1/portfolio
🔑 Auth Token: mock-token-bajaj-2024
```

---

## 📖 Swagger Documentation

Interactive API documentation is available at:

```
http://localhost:3000/api-docs
```

Features:
- Try out APIs directly from browser
- View request/response schemas
- Test authentication with "Authorize" button

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

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/instruments` | Get all instruments | ❌ |
| GET | `/instruments/:id` | Get instrument by ID | ❌ |
| POST | `/orders` | Place new order | ✅ |
| GET | `/orders` | Get all orders | ✅ |
| GET | `/orders/:orderId` | Get order by ID | ✅ |
| GET | `/trades` | Get all trades | ✅ |
| GET | `/trades/:tradeId` | Get trade by ID | ✅ |
| GET | `/portfolio` | Get portfolio holdings | ✅ |
| GET | `/portfolio/:symbol` | Get specific holding | ✅ |

---

## 📝 API Details

### 1. Instrument APIs

#### GET /instruments
Fetch all tradable instruments.

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

---

### 2. Order Management APIs

#### POST /orders
Place a new order.

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
      "symbol": "SBIN",
      "orderType": "BUY",
      "orderStyle": "MARKET",
      "quantity": 5,
      "status": "EXECUTED",
      "filledQuantity": 5,
      "averageFilledPrice": 825.4
    }
  }
}
```

---

### 3. Trade APIs

#### GET /trades
Fetch all executed trades for user.

**Response:**
```json
{
  "success": true,
  "data": {
    "trades": [
      {
        "tradeId": "TRD17365432005678",
        "orderId": "ORD17365432001234",
        "symbol": "SBIN",
        "transactionType": "BUY",
        "quantity": 5,
        "price": 825.4
      }
    ],
    "count": 1
  }
}
```

---

### 4. Portfolio APIs

#### GET /portfolio
Fetch portfolio holdings with P&L calculations.

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

## 📋 Logging

The application includes comprehensive logging for debugging and monitoring:

```
[2024-01-10T10:30:45.123Z] [INFO] Authentication successful {"userId":"USER001","path":"/api/v1/orders"}
[2024-01-10T10:30:45.124Z] [INFO] Order request received {"userId":"USER001","symbol":"SBIN","orderType":"BUY"}
[2024-01-10T10:30:45.125Z] [INFO] Order executed {"orderId":"ORD123","executionPrice":825.4}
[2024-01-10T10:30:45.126Z] [INFO] Trade created {"tradeId":"TRD456","symbol":"SBIN"}
[2024-01-10T10:30:45.127Z] [INFO] Portfolio updated {"userId":"USER001","symbol":"SBIN","action":"BUY"}
```

Log Levels:
- `[INFO]` - Successful operations
- `[WARN]` - Authentication failures, validation issues
- `[ERROR]` - System errors, exceptions

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Results
```
 PASS  tests/instruments.test.js
 PASS  tests/orders.test.js
 PASS  tests/portfolio.test.js
 PASS  tests/trades.test.js

Test Suites: 4 passed, 4 total
Tests:       19 passed, 19 total
```

### Test Coverage

| API | Tests | Coverage |
|-----|-------|----------|
| Instruments | 4 | GET all, GET by ID, 404 handling |
| Orders | 7 | POST (MARKET/LIMIT), validations, auth |
| Portfolio | 6 | GET all, GET by symbol, P&L calculations |
| Trades | 2 | GET all, auth check |

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

## 🎯 Bonus Features Implemented

| Feature | Status | Description |
|---------|--------|-------------|
| Swagger / OpenAPI Documentation | ✅ | Interactive docs at `/api-docs` |
| Basic Logging | ✅ | Timestamped logs with levels |
| Centralized Exception Handling | ✅ | Consistent error responses |
| Unit Tests | ✅ | 19 tests covering all APIs |
| Market Order Auto-Execution | ✅ | Immediate execution simulation |

---

## 📞 Contact

For any queries regarding this implementation:

**Ritvik Rajendrakumar Jaiswal**  
Roll Number: 229301143  
Manipal University Jaipur

---

*Built for Bajaj Broking Campus Hiring Assignment*