require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

app.listen(PORT, () => {
  console.log(`🚀 Bajaj Trading API running on http://localhost:${PORT}`);
  console.log(`📚 Endpoints: /api/v1/instruments, /api/v1/orders, /api/v1/trades, /api/v1/portfolio`);
  console.log(`🔑 Auth Token: ${AUTH_TOKEN}`);
});
