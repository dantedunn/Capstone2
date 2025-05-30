# Video Game Review Site Documentation

## Project Overview

This is a full-stack web application for video game reviews, featuring user authentication, game listings, detailed game information, user reviews, and comments. The application is built with a React frontend and an Express/Node.js backend with PostgreSQL database using Prisma ORM.

## Architecture

The application follows a typical client-server architecture:
- **Frontend**: React-based single-page application
- **Backend**: Express.js REST API
- **Database**: PostgreSQL with Prisma as the ORM
- **Authentication**: JWT (JSON Web Tokens)

## Directory Structure

```
/
├── package.json             # Frontend dependencies and scripts
├── README.md                # Project documentation
├── backend/                 # Backend server code
│   ├── package.json        # Backend dependencies and scripts
│   ├── server.js           # Express server setup and API endpoints
│   └── prisma/             # Database configuration
│       ├── schema.prisma   # Database schema definition
│       └── seed.js         # Initial data seeding script
├── public/                  # Public assets
│   ├── favicon.ico         # Site favicon
│   ├── index.html          # HTML entry point
│   └── placeholder-game.jpg # Default game image
└── src/                     # Frontend source code
    ├── App.js              # Main React component
    ├── config.js           # Frontend configuration
    ├── index.js            # React entry point
    ├── api/                # API communication
    │   └── api.js          # API client functions
    ├── components/         # React components
    │   ├── GameDetail.js   # Game details page
    │   ├── GameList.js     # Game listing page
    │   ├── Login.js        # Login page
    │   ├── NavigationBar.js # Navigation component
    │   ├── PrivateRoute.js  # Auth-protected routes
    │   ├── ReviewForm.js    # Review submission form
    │   ├── SearchResults.js  # Search results page
    │   └── SignUp.js        # Registration page
    ├── context/            # React context providers
    │   └── AuthContext.js  # Authentication context
    └── styles/             # Component styles
        ├── App.css         # Global styles
        ├── Auth.css        # Auth form styles
        ├── GameDetail.css  # Game details page styles
        ├── GameList.css    # Game listing styles
        └── ReviewForm.css  # Review form styles
```

## Backend Components

### 1. `server.js`

**Purpose**: Main entry point for the backend Express.js server.

**Key Dependencies**:
- `express`: Web application framework
- `cors`: Cross-Origin Resource Sharing middleware
- `morgan`: HTTP request logger
- `body-parser`: Parse HTTP request bodies
- `jsonwebtoken`: JWT implementation for authentication
- `bcrypt`: Password hashing library
- `@prisma/client`: Prisma database client
- `dotenv`: Environment variable management

**Main Features**:
- REST API endpoints for games, reviews, comments, and users
- Authentication middleware using JWT
- Role-based access control (admin vs regular users)
- Error handling middleware
- Graceful server shutdown handling

### 2. `prisma/schema.prisma`

**Purpose**: Defines the database schema and relationships.

**Models**:
- `User`: User accounts with authentication details
- `Game`: Video game information
- `Review`: User reviews for games
- `Comment`: User comments on reviews

**Relationships**:
- A user can have many reviews and comments
- A game can have many reviews
- A review can have many comments
- Each review belongs to one user and one game
- Each comment belongs to one user and one review

### 3. `prisma/seed.js`

**Purpose**: Seeds the database with initial data.

**Key Features**:
- Creates admin and regular user accounts
- Populates the database with sample games
- Creates initial reviews and comments

## Frontend Components

### 1. `src/App.js`

**Purpose**: Main React component and route definition.

**Key Dependencies**:
- `react-router-dom`: Routing library
- Material-UI components (via multiple component imports)

**Features**:
- Sets up routing for different pages
- Wraps the application with the authentication provider
- Handles routing for search results

### 2. `src/api/api.js`

**Purpose**: Centralizes API communication between frontend and backend.

**Key Features**:
- Helper functions for API calls
- Authentication token management
- Standardized error handling
- Functions for all API endpoints (games, reviews, comments, auth)

### 3. `src/context/AuthContext.js`

**Purpose**: Manages authentication state across the application.

**Key Features**:
- User authentication state
- Login/logout functionality
- Token storage in localStorage
- Context provider for authentication data

### 4. `src/components/GameList.js`

**Purpose**: Displays the list of available games.

**Key Features**:
- Fetches games from the API
- Displays game cards with basic information
- Loading states and error handling

### 5. `src/components/GameDetail.js`

**Purpose**: Shows detailed information about a specific game.

**Key Features**:
- Fetches game details and reviews
- Conditionally displays review form for authenticated users
- Shows existing reviews with user information
- Handles review submission

### 6. `src/components/Login.js` & `src/components/SignUp.js`

**Purpose**: User authentication forms.

**Key Features**:
- Form validation
- API integration with auth endpoints
- Error handling and feedback

### 7. `src/components/NavigationBar.js`

**Purpose**: Site navigation and user status display.

**Key Features**:
- Conditional rendering based on authentication state
- Admin-specific navigation options
- Logout functionality
- Search bar for searching games by name, description, genre, etc.

### 8. `src/components/ReviewForm.js`

**Purpose**: Form for submitting game reviews.

**Key Features**:
- Star rating input
- Text review input with validation
- Submission handling and error feedback

### 9. `src/components/PrivateRoute.js`

**Purpose**: Route protection for authenticated users.

**Key Features**:
- Redirects unauthenticated users to login page
- Preserves attempted access URL for post-login redirect

### 10. `src/components/SearchResults.js`

**Purpose**: Displays search results from the game database.

**Key Features**:
- Processes search queries from URL parameters
- Displays matching games in a grid layout
- Shows loading states and error handling
- Provides breadcrumb navigation for user orientation
- Handles "no results found" with helpful suggestions

## Key Packages and Dependencies

### Backend Dependencies
- **express**: Web application framework
- **@prisma/client**: ORM for database access
- **bcrypt**: Password hashing and verification
- **jsonwebtoken**: Authentication via JWT
- **cors**: Cross-origin resource sharing
- **morgan**: HTTP request logging
- **body-parser**: Request body parsing
- **pg**: PostgreSQL client
- **dotenv**: Environment variable management

### Frontend Dependencies
- **react**: UI library
- **react-router-dom**: Client-side routing
- **@material-ui/core**: Material Design components
- **@material-ui/icons**: Material Design icons
- **@material-ui/lab**: Additional Material UI components

## Database Schema

### User Table
- `id`: UUID primary key
- `username`: String (unique)
- `password`: String (hashed)
- `email`: String (unique)
- `role`: String (admin or user)

### Game Table
- `id`: UUID primary key
- `name`: String (unique)
- `description`: String (optional)
- `genre`: String (optional)
- `platform`: String (optional)
- `publisher`: String (optional)
- `gameMode`: String (optional)
- `theme`: String (optional)
- `releaseDate`: DateTime (optional)
- `averageRating`: Decimal (optional)
- `imageUrl`: String (optional)

### Review Table
- `id`: UUID primary key
- `content`: String
- `rating`: Integer
- `userId`: UUID (foreign key to User)
- `gameId`: UUID (foreign key to Game)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Unique constraint: One review per user per game

### Comment Table
- `id`: UUID primary key
- `content`: String
- `userId`: UUID (foreign key to User)
- `reviewId`: UUID (foreign key to Review)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Authentication Flow

1. User registers or logs in through the frontend forms
2. Backend validates credentials and issues a JWT token
3. Frontend stores the token in localStorage
4. Token is included in the Authorization header for authenticated requests
5. Protected routes and actions check for valid tokens
6. Admin-specific actions verify the user role in addition to authentication

## API Endpoints

### Authentication
- `POST /api/auth/signup`: Create a new user account
- `POST /api/auth/login`: Authenticate a user and receive a JWT token

### Games
- `GET /api/games`: Get all games
- `GET /api/games/:id`: Get a specific game by ID
- `GET /api/games/search`: Search for games by name
- `POST /api/games`: Add a new game (admin only)
- `PUT /api/games/:id`: Update a game (admin only)
- `DELETE /api/games/:id`: Delete a game (admin only)

### Reviews
- `GET /api/reviews`: Get all reviews by the authenticated user
- `GET /api/games/:id/reviews`: Get all reviews for a specific game
- `POST /api/games/:id/reviews`: Add a review for a game
- `PUT /api/reviews/:id`: Update a review
- `DELETE /api/reviews/:id`: Delete a review

### Comments
- `GET /api/reviews/:reviewId/comments`: Get all comments for a review
- `POST /api/reviews/:reviewId/comments`: Add a comment to a review
- `PUT /api/comments/:id`: Update a comment
- `DELETE /api/comments/:id`: Delete a comment

### Admin
- `GET /api/admin/users`: Get all users (admin only)
- `PUT /api/admin/users/:id`: Update a user's role (admin only)

## Process Flow

### User Authentication Flow
1. User navigates to login/signup page
2. User submits credentials
3. Backend validates credentials and issues JWT token
4. Frontend stores token in localStorage
5. User redirected to the page they were attempting to access

### Game Browsing Flow
1. User visits the home page
2. Frontend fetches games from the API
3. Games are displayed in a grid format
4. User can click on a game for detailed information

### Game Detail Flow
1. User clicks on a game in the list
2. Frontend fetches detailed game information and reviews
3. Game details and existing reviews are displayed
4. Authenticated users can submit new reviews
5. Reviews are displayed with user information and creation date

### Review Submission Flow
1. Authenticated user visits a game details page
2. User fills out the review form with content and rating
3. Frontend validates form input
4. Review is submitted to the API
5. Upon success, the review list is updated
6. System prevents multiple reviews per game per user

### Admin Functions Flow
1. Admin user logs in with admin credentials
2. Admin-specific navigation options are displayed
3. Admin can manage users, games, and reviews
4. Admin actions go through additional authorization checks

## Default Accounts

The system is seeded with two default accounts:

1. **Admin Account**:
   - Username: admin
   - Password: admin123
   - Email: admin@example.com
   - Role: admin

2. **Regular User Account**:
   - Username: user
   - Password: user123
   - Email: user@example.com
   - Role: user

## Security Considerations

1. **Password Security**:
   - Passwords are hashed using bcrypt
   - No plaintext passwords stored in the database

2. **Authentication**:
   - JWT tokens with expiration
   - Protected routes both on frontend and backend

3. **Authorization**:
   - Role-based access control
   - Admin-specific endpoints protected by middleware

4. **Input Validation**:
   - Form validation on the frontend
   - Backend validation for all inputs

5. **CORS Configuration**:
   - Configured to allow requests from the frontend origin
   - Credentials supported for authenticated requests

## Development Setup

1. **Backend Setup**:
   ```
   cd backend
   npm install
   npx prisma db push
   npx prisma db seed
   npm run dev
   ```

2. **Frontend Setup**:
   ```
   npm install
   npm start
   ```

3. **Database Configuration**:
   - Create a PostgreSQL database
   - Update DATABASE_URL in backend/.env
   - Run Prisma migrations

4. **Environment Variables**:
   - JWT_SECRET: Secret key for JWT tokens
   - DATABASE_URL: PostgreSQL connection string
   - PORT: Server port (default: 5002)

## Deployment Considerations

1. **Frontend Deployment**:
   - Build with `npm run build`
   - Serve static files from build directory

2. **Backend Deployment**:
   - Set up Node.js environment
   - Configure production database
   - Set secure environment variables
   - Use process manager (PM2, etc.)

3. **Database**:
   - Set up production PostgreSQL database
   - Run migrations
   - Consider backup strategy

4. **Security**:
   - Use HTTPS
   - Set more restrictive CORS in production
   - Review JWT expiration policies
   - Consider rate limiting

## Troubleshooting

### Common Issues and Solutions

1. **Connection Issues**:
   - Check if backend server is running
   - Verify the correct port in proxy settings
   - Check CORS configuration

2. **Authentication Problems**:
   - Verify token storage in localStorage
   - Check token expiration
   - Verify credentials against seeded users

3. **Database Issues**:
   - Check connection string
   - Ensure PostgreSQL service is running
   - Verify Prisma schema matches database

4. **API Errors**:
   - Check request format and parameters
   - Verify authentication headers
   - Look for validation errors in responses

## Future Enhancements

1. **Feature Enhancements**:
   - User profile pages
   - Advanced search and filtering
   - Social sharing functionality
   - Rating analytics and charts

2. **Technical Improvements**:
   - Implement unit and integration tests
   - Add server-side rendering
   - Implement caching for better performance
   - Containerize the application with Docker

3. **UI/UX Improvements**:
   - Responsive design enhancements
   - Dark/light theme toggle
   - Accessibility improvements
   - Internationalization support

---

**Documentation Created**: May 24, 2025  
**Project**: Video Game Review Site  
**Author**: Dante Dunn
