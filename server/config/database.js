const { Sequelize } = require('sequelize');

// Load environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_NAME = process.env.DB_NAME || 'hotel_management';
const DB_PORT = process.env.DB_PORT || 5432;

// Create a Sequelize instance for PostgreSQL connection
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = { sequelize };