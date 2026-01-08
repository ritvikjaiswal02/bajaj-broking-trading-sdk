const logger = {
  info: (message, data = {}) => {
    console.log(`[${new Date().toISOString()}] [INFO] ${message}`, Object.keys(data).length ? JSON.stringify(data) : '');
  },
  
  warn: (message, data = {}) => {
    console.warn(`[${new Date().toISOString()}] [WARN] ${message}`, Object.keys(data).length ? JSON.stringify(data) : '');
  },
  
  error: (message, data = {}) => {
    console.error(`[${new Date().toISOString()}] [ERROR] ${message}`, Object.keys(data).length ? JSON.stringify(data) : '');
  },
  
  debug: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${new Date().toISOString()}] [DEBUG] ${message}`, Object.keys(data).length ? JSON.stringify(data) : '');
    }
  }
};

module.exports = logger;
