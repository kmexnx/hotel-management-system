const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.STRING, // Single, Double, Twin, Suite, etc.
    allowNull: false
  },
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Available', 'Occupied', 'Maintenance', 'Reserved'),
    allowNull: false,
    defaultValue: 'Available'
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  hasWifi: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  hasTV: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  hasAirCon: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  hasBalcony: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  }
}, {
  tableName: 'rooms',
  timestamps: true
});

module.exports = Room;