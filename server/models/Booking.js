const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Guest = require('./Guest');
const Room = require('./Room');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  checkInDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  checkOutDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  numberOfGuests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Partially Paid', 'Refunded', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  bookingStatus: {
    type: DataTypes.ENUM('Confirmed', 'Checked In', 'Checked Out', 'Cancelled', 'No Show'),
    allowNull: false,
    defaultValue: 'Confirmed'
  },
  paymentMethod: {
    type: DataTypes.STRING, // Credit Card, Cash, Bank Transfer, etc.
    allowNull: true
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  bookingReference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'bookings',
  timestamps: true,
  hooks: {
    beforeCreate: (booking) => {
      // Generate a unique booking reference number if not provided
      if (!booking.bookingReference) {
        const prefix = 'BK';
        const timestamp = Date.now().toString().substring(4);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        booking.bookingReference = `${prefix}-${timestamp}-${random}`;
      }
    }
  }
});

// Define relationships
Booking.belongsTo(Guest, { foreignKey: 'guestId', as: 'guest' });
Booking.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

Guest.hasMany(Booking, { foreignKey: 'guestId', as: 'bookings' });
Room.hasMany(Booking, { foreignKey: 'roomId', as: 'bookings' });

module.exports = Booking;