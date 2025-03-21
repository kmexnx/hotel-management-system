# Hotel Management System

A CRUD application for hotel management using PostgreSQL, Node.js, and React.

## Features

- Guest management (create, read, update, delete)
- Room management (create, read, update, delete)
- Booking management (create, read, update, delete)
- Staff management (create, read, update, delete)

## Tech Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **API**: RESTful API

## Directory Structure

```
hotel-management-system/
├── client/                  # React frontend
│   ├── public/              # Public assets
│   └── src/                 # Source files
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
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

## Project Status

The project now includes:

### Backend
- Database models for Guests, Rooms, Bookings, and Staff
- Controllers for all CRUD operations
- RESTful API endpoints
- Database connection configuration

### Frontend
- Basic layout with Navbar, Sidebar, and Footer
- Dashboard with overview of hotel statistics
- Guest management interface (list view and form for adding/editing)
- Room management interface (grid view and form for adding/editing)
- Booking management interface (list view with filtering and form for adding/editing)
- API service for communicating with the backend

### To Be Completed
- Staff management UI
- Authentication and authorization
- Additional features like reports and analytics

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

## Key Features Implemented

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

## Next Steps for Development

To complete this application, the following steps are recommended:

1. Implement the Staff management UI (similar pattern to guests)
2. Add authentication and authorization (JWT, role-based access)
3. Implement more advanced features:
   - Room availability calendar view
   - Booking confirmation emails
   - Payment integration
   - Reporting and analytics dashboard
   - Guest check-in/check-out process

## License

MIT