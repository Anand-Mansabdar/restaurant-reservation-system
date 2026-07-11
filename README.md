# Restaurant Reservation System

A full-stack restaurant reservation management system with role-based access control, automatic table assignment, and real-time availability checking.

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication with httpOnly cookies
- **bcryptjs** for password hashing
- **helmet** for security headers
- **cors** for cross-origin resource sharing

### Frontend
- **React 19** with Vite
- **React Router DOM** for routing
- **Axios** for API calls
- **React Hook Form** for form management
- **React Hot Toast** for notifications
- **jwt-decode** for token parsing

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment variables:**
   Create a `.env` file in the Backend directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment variables:**
   Create a `.env` file in the Frontend directory with the following variable:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Deployment

**Backend (Render):**
- Set environment variables in Render dashboard
- Deploy from GitHub repository
- Backend URL: `https://restaurant-reservation-system-5px6.onrender.com`

**Frontend (Vercel):**
- Set `VITE_API_URL` environment variable to the deployed backend URL
- Deploy from GitHub repository
- Frontend URL: `https://restaurant-reservation-system-gilt.vercel.app`

## Testing Credentials

For testing purposes, you can use the following credentials:

### Admin Account
- **Username:** Admin
- **Email:** admin@gmail.com
- **Password:** Admin123

### Customer Account
- **Username:** Customer
- **Email:** customer@gmail.com
- **Password:** Customer123

**Note:** These accounts need to be created manually in the database or through the registration interface before use. The admin account should be created with the "admin" role to access admin features.

## Assumptions Made

1. **Time Slots:** Fixed time slots (11:00-12:00, 12:00-13:00, etc.) rather than flexible booking times
2. **Table Assignment:** Automatic assignment of the smallest suitable table for efficiency
3. **Date Handling:** All dates are normalized to midnight UTC to avoid timezone issues
4. **User Roles:** Only two roles (customer and admin) - no staff or manager roles
5. **Authentication:** JWT tokens stored in httpOnly cookies for security
6. **Reservation Duration:** Each reservation is for exactly one hour
7. **Operating Hours:** Restaurant operates 11:00-15:00 and 18:00-22:00
8. **Capacity:** Maximum table capacity is 20 guests
9. **Soft Delete:** Reservations and tables use soft delete (status changes) for audit trail
10. **No Payment:** System assumes payment is handled separately (offline or other system)

## Reservation and Availability Logic

### Table Assignment Algorithm

When a customer creates a reservation, the system follows this logic:

1. **Validation:**
   - Date must be today or in the future
   - Time slot must be valid
   - Number of guests must be at least 1

2. **Find Candidate Tables:**
   - Query all active tables with capacity >= number of guests
   - Sort by capacity (smallest first) for optimal space utilization

3. **Check Availability:**
   - Find all tables already booked for the same date and time slot
   - Filter out booked tables from candidate tables

4. **Race Condition Handling:**
   - Attempt to book the first available table
   - If a concurrent request books the same table (MongoDB duplicate key error), try the next available table
   - Continue until successful or no tables remain

5. **Error Handling:**
   - No suitable table capacity → 404 error
   - No available tables → 409 conflict error
   - All tables lost race condition → 409 conflict error

### Availability Rules

- **Double Booking Prevention:** MongoDB partial unique index on (table, date, timeSlot) with status = "Booked"
- **Capacity Constraints:** Table must have capacity >= number of guests
- **Time Slot Exclusivity:** Each table can only have one reservation per time slot
- **Active Tables Only:** Inactive tables are excluded from availability
- **Cancellation Frees Capacity:** Cancelled reservations free up the table for new bookings

### Reservation States

- **Booked:** Active reservation, table is occupied
- **Cancelled:** Customer or admin cancelled, table is available
- **Completed:** Reservation was fulfilled (for future analytics)

## Role-Based Access Control

### Customer Role

**Permissions:**
- Register new account
- Login/logout
- Create reservations (automatic table assignment)
- View own reservations only
- Cancel own reservations (if status is "Booked")

**Restricted Access:**
- Cannot view other customers' reservations
- Cannot modify reservation details (date, time, guests)
- Cannot access admin dashboard
- Cannot manage tables

**Authentication:**
- JWT token in httpOnly cookie
- Token expires after 7 days
- Must be authenticated for all reservation operations

### Admin Role

**Permissions:**
- All customer permissions
- View all reservations (filtered by date if desired)
- Update any reservation (date, time, guests, table, status)
- Cancel any reservation
- View all tables
- Create new tables
- Update table details (number, capacity, active status)
- Deactivate tables (soft delete)

**Admin Dashboard Features:**
- Overview statistics (total reservations, active tables, etc.)
- Reservation management with filtering
- Table management with capacity planning

**Authentication:**
- Same JWT mechanism as customers
- Additional role verification middleware
- Can access both customer and admin routes

### Security Measures

1. **Password Hashing:** bcrypt with salt rounds (10)
2. **JWT Validation:** Token verification on every protected route
3. **Role Middleware:** Separate middleware for admin/customer access
4. **Ownership Checks:** Customers can only modify their own reservations
5. **httpOnly Cookies:** Prevents XSS attacks on tokens
6. **CORS Configuration:** Specific origin whitelist in production
7. **Helmet:** Security headers for Express
8. **Input Validation:** Express-validator for request sanitization

## Known Limitations

1. **No Email Verification:** Users can register with any email without verification
2. **No Password Reset:** Forgot password functionality not implemented
3. **No Real-time Updates:** Frontend must refresh to see changes
4. **Fixed Time Slots:** Cannot accommodate custom reservation durations
5. **No Waitlist:** When fully booked, customers cannot join a waitlist
6. **No Payment Integration:** No payment processing or deposit system
7. **No Notification System:** No email/SMS reminders for reservations
8. **No Analytics:** Limited reporting and business intelligence
9. **Single Restaurant:** Not designed for multi-location chains
10. **No Table Preferences:** Customers cannot request specific tables
11. **No Special Requests:** No field for dietary requirements or special occasions
12. **Timezone Handling:** All dates normalized to UTC, may cause confusion
13. **No Rate Limiting:** Vulnerable to brute force attacks on login
14. **No Session Management:** Cannot force logout or view active sessions
15. **No Audit Log:** Admin actions are not logged for accountability

## Areas for Improvement with Additional Time

### High Priority
1. **Email Verification:** Implement email verification for registration
2. **Password Reset:** Add forgot password functionality with email links
3. **Real-time Updates:** Use WebSockets for live availability updates
4. **Rate Limiting:** Implement rate limiting on authentication endpoints
5. **Waitlist System:** Allow customers to join waitlist when fully booked

### Medium Priority
6. **Flexible Time Slots:** Allow custom reservation durations
7. **Table Preferences:** Let customers request specific tables or areas
8. **Special Requests:** Add dietary requirements and special occasion fields
9. **Notification System:** Email/SMS reminders for upcoming reservations
10. **Analytics Dashboard:** Business intelligence and reporting features

### Low Priority
11. **Payment Integration:** Stripe/PayPal for deposits or full payment
12. **Multi-location Support:** Scale for restaurant chains
13. **Mobile App:** React Native or PWA for mobile experience
14. **Review System:** Customer feedback and rating system
15. **Loyalty Program:** Points and rewards for frequent customers

### Technical Improvements
16. **Comprehensive Testing:** Unit tests, integration tests, E2E tests
17. **API Documentation:** Swagger/OpenAPI documentation
18. **Monitoring:** Error tracking (Sentry) and performance monitoring
19. **CI/CD Pipeline:** Automated testing and deployment
20. **Database Optimization:** Query optimization and indexing strategy
21. **Caching:** Redis caching for frequently accessed data
22. **Load Balancing:** Horizontal scaling for high traffic
23. **Audit Logging:** Track all admin actions for compliance
24. **Session Management:** Active session viewing and revocation
25. **Timezone Support:** Proper timezone handling for international users

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

### Reservations (Customer)
- `POST /reservations` - Create reservation
- `GET /reservations/my` - Get my reservations
- `DELETE /reservations/:id` - Cancel my reservation

### Admin
- `GET /admin/reservations` - Get all reservations (optional date filter)
- `PUT /admin/reservations/:id` - Update reservation
- `DELETE /admin/reservations/:id` - Cancel any reservation

### Tables
- `GET /tables` - Get all tables
- `POST /tables` - Create table (admin only)
- `PUT /tables/:id` - Update table (admin only)
- `DELETE /tables/:id` - Deactivate table (admin only)

### Health
- `GET /health` - Health check endpoint

## Database Schema

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ["customer", "admin"], default: "customer"),
  createdAt: Date,
  updatedAt: Date
}
```

### Table Model
```javascript
{
  tableNumber: Number (required, unique, positive),
  capacity: Number (required, 1-20),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Reservation Model
```javascript
{
  customer: ObjectId (ref: User, required),
  table: ObjectId (ref: Table, required),
  date: Date (required),
  timeSlot: String (enum: predefined slots, required),
  guests: Number (required, min 1),
  status: String (enum: ["Booked", "Cancelled", "Completed"], default: "Booked"),
  createdAt: Date,
  updatedAt: Date
}
```

## License

ISC
