const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING, // Manager, Receptionist, Housekeeper, Maintenance, etc.
    allowNull: false
  },
  department: {
    type: DataTypes.STRING, // Front Desk, Housekeeping, Maintenance, F&B, etc.
    allowNull: false
  },
  hireDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emergencyContact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emergencyPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'staff',
  timestamps: true
});

module.exports = Staff;