import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Page components
import Dashboard from './pages/Dashboard';
import GuestList from './pages/guests/GuestList';
import GuestForm from './pages/guests/GuestForm';
import RoomList from './pages/rooms/RoomList';
import RoomForm from './pages/rooms/RoomForm';
import BookingList from './pages/bookings/BookingList';
import BookingForm from './pages/bookings/BookingForm';
import StaffList from './pages/staff/StaffList';
import StaffForm from './pages/staff/StaffForm';
import NotFound from './pages/NotFound';

// CSS
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            {/* Guest Routes */}
            <Route path="/guests" element={<GuestList />} />
            <Route path="/guests/add" element={<GuestForm />} />
            <Route path="/guests/edit/:id" element={<GuestForm />} />
            
            {/* Room Routes */}
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/rooms/add" element={<RoomForm />} />
            <Route path="/rooms/edit/:id" element={<RoomForm />} />
            
            {/* Booking Routes */}
            <Route path="/bookings" element={<BookingList />} />
            <Route path="/bookings/add" element={<BookingForm />} />
            <Route path="/bookings/edit/:id" element={<BookingForm />} />
            
            {/* Staff Routes */}
            <Route path="/staff" element={<StaffList />} />
            <Route path="/staff/add" element={<StaffForm />} />
            <Route path="/staff/edit/:id" element={<StaffForm />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;