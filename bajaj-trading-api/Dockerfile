# Use official Node.js runtime as parent image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (default 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
