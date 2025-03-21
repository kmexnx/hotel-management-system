# Multi-stage build for Hotel Management System

# Stage 1: Build the React front-end
FROM node:16-alpine as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Set up the Node.js back-end
FROM node:16-alpine
WORKDIR /app

# Install dependencies for server
COPY server/package*.json ./
RUN npm install

# Copy server code
COPY server/ ./

# Copy built client from stage 1
COPY --from=client-builder /app/client/build ./public

# Expose port for API
EXPOSE 5000

# Command to run the application
CMD ["node", "index.js"]
