# Hotel Management System

A complete CRUD application for hotel management using PostgreSQL, Node.js, and React.

## Features

- Guest management (create, read, update, delete)
- Room management (create, read, update, delete)
- Booking management (create, read, update, delete)
- Staff management (create, read, update, delete)
- Modern responsive UI with intuitive navigation
- Dashboard with hotel statistics overview

## Tech Stack

- **Frontend**: React.js, React Router, Axios, React Icons
- **Backend**: Node.js, Express.js, Sequelize ORM
- **Database**: PostgreSQL
- **API**: RESTful API

## Directory Structure

```
hotel-management-system/
├── client/                  # React frontend
│   ├── public/              # Public assets
│   └── src/                 # Source files
│       ├── components/      # Reusable components
│       │   └── layout/      # Layout components (Navbar, Sidebar, Footer)
│       ├── pages/           # Page components
│       │   ├── bookings/    # Booking-related components
│       │   ├── guests/      # Guest-related components
│       │   ├── rooms/       # Room-related components
│       │   └── staff/       # Staff-related components
│       ├── services/        # API services
│       └── App.js           # Main App component
├── server/                  # Node.js backend
│   ├── config/              # Database configuration
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   └── index.js             # Server entry point
└── README.md                # This file
```

## Implemented Features

### Guest Management
- View list of all guests with search functionality
- Add new guests with form validation
- Edit and delete existing guests

### Room Management
- View rooms in a grid layout with status indicators
- Filter rooms by status and search by name or type
- Add new rooms with amenities selection
- Edit and delete existing rooms

### Booking Management
- Comprehensive booking list with status indicators and payment information
- Advanced filtering by date range, status, and search
- Create new bookings with automatic price calculation
- Room availability checking during booking
- Edit and delete existing bookings

### Staff Management
- View staff in both grid and list layouts
- Filter staff by department and search by name, email, or phone
- Add new staff members with department-specific role selection
- Edit and delete existing staff members

### Dashboard
- Overview of key hotel statistics
- Quick access to common actions
- Status indicators for room availability and bookings

## Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- PostgreSQL (v13 or newer)

## Setup Instructions

### Database Setup

1. Install PostgreSQL if you haven't already
2. Create a new database:

```sql
CREATE DATABASE hotel_management;
```

3. The tables will be created automatically when running the backend server for the first time

### Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the server directory with the following content (adjust as needed):

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=hotel_management
DB_PORT=5432
PORT=5000
```

4. Start the server:

```bash
npm start
```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The frontend will run on http://localhost:3000

## API Endpoints

### Guests
- `GET /api/guests` - Get all guests
- `GET /api/guests/:id` - Get a specific guest
- `POST /api/guests` - Create a new guest
- `PUT /api/guests/:id` - Update a guest
- `DELETE /api/guests/:id` - Delete a guest

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get a specific room
- `GET /api/rooms/available` - Get available rooms for a date range
- `POST /api/rooms` - Create a new room
- `PUT /api/rooms/:id` - Update a room
- `DELETE /api/rooms/:id` - Delete a room

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get a specific booking
- `GET /api/bookings/guest/:guestId` - Get bookings by guest ID
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Delete a booking

### Staff
- `GET /api/staff` - Get all staff members
- `GET /api/staff/:id` - Get a specific staff member
- `GET /api/staff/department/:department` - Get staff by department
- `POST /api/staff` - Create a new staff member
- `PUT /api/staff/:id` - Update a staff member
- `DELETE /api/staff/:id` - Delete a staff member

## Future Enhancements

To further improve this application, the following enhancements could be implemented:

1. **Authentication and Authorization**
   - User login and registration
   - Role-based access control (Admin, Manager, Staff)
   - User profile management

2. **Advanced Features**
   - Room availability calendar view
   - Booking confirmation emails
   - Payment integration
   - Analytics and reporting dashboard
   - Guest check-in/check-out process
   
3. **Technical Improvements**
   - Unit and integration tests
   - Dockerization for easy deployment
   - CI/CD pipeline
   - Performance optimizations

## License

MIT