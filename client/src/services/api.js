import axios from 'axios';

// Create an Axios instance with default configurations
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Guest API services
export const guestService = {
  getAllGuests: async () => {
    try {
      const response = await api.get('/guests');
      return response.data;
    } catch (error) {
      console.error('Error fetching guests:', error);
      throw error;
    }
  },
  
  getGuestById: async (id) => {
    try {
      const response = await api.get(`/guests/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching guest with ID ${id}:`, error);
      throw error;
    }
  },
  
  createGuest: async (guestData) => {
    try {
      const response = await api.post('/guests', guestData);
      return response.data;
    } catch (error) {
      console.error('Error creating guest:', error);
      throw error;
    }
  },
  
  updateGuest: async (id, guestData) => {
    try {
      const response = await api.put(`/guests/${id}`, guestData);
      return response.data;
    } catch (error) {
      console.error(`Error updating guest with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteGuest: async (id) => {
    try {
      const response = await api.delete(`/guests/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting guest with ID ${id}:`, error);
      throw error;
    }
  }
};

// Room API services
export const roomService = {
  getAllRooms: async () => {
    try {
      const response = await api.get('/rooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },
  
  getRoomById: async (id) => {
    try {
      const response = await api.get(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room with ID ${id}:`, error);
      throw error;
    }
  },
  
  getAvailableRooms: async (checkInDate, checkOutDate) => {
    try {
      const response = await api.get('/rooms/available', {
        params: { checkInDate, checkOutDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      throw error;
    }
  },
  
  createRoom: async (roomData) => {
    try {
      const response = await api.post('/rooms', roomData);
      return response.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },
  
  updateRoom: async (id, roomData) => {
    try {
      const response = await api.put(`/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      console.error(`Error updating room with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteRoom: async (id) => {
    try {
      const response = await api.delete(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting room with ID ${id}:`, error);
      throw error;
    }
  }
};

// Booking API services
export const bookingService = {
  getAllBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },
  
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking with ID ${id}:`, error);
      throw error;
    }
  },
  
  getBookingsByGuest: async (guestId) => {
    try {
      const response = await api.get(`/bookings/guest/${guestId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching bookings for guest with ID ${guestId}:`, error);
      throw error;
    }
  },
  
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  
  updateBooking: async (id, bookingData) => {
    try {
      const response = await api.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error(`Error updating booking with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteBooking: async (id) => {
    try {
      const response = await api.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting booking with ID ${id}:`, error);
      throw error;
    }
  }
};

// Staff API services
export const staffService = {
  getAllStaff: async () => {
    try {
      const response = await api.get('/staff');
      return response.data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },
  
  getStaffById: async (id) => {
    try {
      const response = await api.get(`/staff/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching staff with ID ${id}:`, error);
      throw error;
    }
  },
  
  getStaffByDepartment: async (department) => {
    try {
      const response = await api.get(`/staff/department/${department}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching staff in department ${department}:`, error);
      throw error;
    }
  },
  
  createStaff: async (staffData) => {
    try {
      const response = await api.post('/staff', staffData);
      return response.data;
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  },
  
  updateStaff: async (id, staffData) => {
    try {
      const response = await api.put(`/staff/${id}`, staffData);
      return response.data;
    } catch (error) {
      console.error(`Error updating staff with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteStaff: async (id) => {
    try {
      const response = await api.delete(`/staff/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting staff with ID ${id}:`, error);
      throw error;
    }
  }
};

export default {
  guestService,
  roomService,
  bookingService,
  staffService
};