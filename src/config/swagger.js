const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bajaj Broking Trading SDK API',
      version: '1.0.0',
      description: 'A simplified Trading API SDK for stock broking operations',
      contact: {
        name: 'Ritvik Rajendrakumar Jaiswal',
        email: 'ritvik.jaiswal@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'Use token: mock-token-bajaj-2024'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
