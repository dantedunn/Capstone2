# Video Game Review Site

This project is a full-stack application that serves as a video game review website. It allows users to browse video games, view detailed information about each game, submit reviews, and search for games.

## Features

- User authentication (login/signup) with JWT tokens
- Game browsing with search functionality
- Detailed game information display
- User reviews and ratings system
- Comments on reviews
- Admin functionality for managing games and users
- Responsive design for various screen sizes

## Project Structure

```
video-game-review-site-1
├── README.md                # Project documentation
├── documentation.md         # Additional documentation
├── backend                  # Express.js backend
│   ├── prisma
│   │   ├── schema.prisma    # Prisma database schema
│   │   ├── seed.js          # Database seeding script
│   │   └── migrations/      # Database migrations
│   ├── server.js            # Main server file
│   └── package.json         # Backend dependencies
├── frontend                 # React frontend
│   ├── package.json         # Frontend dependencies
│   ├── public               # Public assets
│   │   ├── index.html       # HTML entry point
│   │   ├── favicon.ico      # Website favicon
│   │   └── placeholder-game.jpg # Default game image
│   └── src                  # Source code
│       ├── api
│       │   └── api.js       # API functions for backend communication
│       ├── components
│       │   ├── GameList.js  # Component for listing games
│       │   ├── GameDetail.js # Component for game details
│       │   ├── NavigationBar.js # Navigation with search functionality
│       │   ├── ReviewForm.js # Component for submitting reviews
│       │   ├── SearchResults.js # Component for displaying search results
│       │   ├── Login.js     # Login component
│       │   ├── SignUp.js    # Signup component
│       │   └── PrivateRoute.js # Route protection component
│       ├── context
│       │   └── AuthContext.js # Authentication context provider
│       ├── styles           # CSS styles for components
│       │   ├── App.css      # Main application styles
│       │   ├── Auth.css     # Authentication pages styles
│       │   ├── GameDetail.css # Game detail page styles
│       │   ├── GameList.css # Game list styles
│       │   └── ReviewForm.css # Review form styles
│       ├── App.js           # Main application component
│       ├── config.js        # Application configuration
│       └── index.js         # Entry point for the React application
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd video-game-review-site-1
   ```

3. Set up the backend:
   ```bash
   cd backend
   npm install
   ```

4. Create a `.env` file in the backend directory using the provided `.env.example` as a template:
   ```
   cp .env.example .env
   ```
   Then edit the `.env` file with your specific database credentials and JWT secret:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/videogamereview"
   JWT_SECRET="your-jwt-secret-key"
   PORT=5001
   ```

5. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npm run seed # If you want to seed the database with initial data
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:5001

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:3000` to view the application.

## Available Scripts

In the project directory, you can run:

### Backend

- `npm run dev` - Starts the backend server in development mode with hot reload
- `npm start` - Starts the backend server
- `npm run seed` - Seeds the database with initial data

### Frontend

- `npm start` - Runs the frontend app in development mode
- `npm test` - Runs tests
- `npm run build` - Builds the app for production

## Database Schema

The application uses PostgreSQL with Prisma ORM. The schema includes:

- User (authentication and user info)
- Game (video game information)
- Review (user reviews for games)
- Comment (comments on reviews)

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## Troubleshooting

### Common Backend Issues

1. **Missing dependencies error:**
   ```
   Error: Cannot find module 'dotenv'
   ```
   Solution: Install the missing package
   ```bash
   cd backend
   npm install dotenv
   ```

2. **Database connection issues:**
   - Check that your PostgreSQL service is running
   - Verify your DATABASE_URL in the .env file is correct
   - Ensure you've run the migrations: `npx prisma migrate dev`

3. **Port already in use:**
   ```
   Port 5001 is already in use
   ```
   Solution: Kill the process using the port or change the port in .env file
   ```bash
   killall -9 node
   ```
   
### Common Frontend Issues

1. **API connection errors:**
   - Ensure the backend server is running on port 5001
   - Check that the proxy in package.json is set to "http://localhost:5001"
   - Look for CORS issues in browser console

2. **"createdAt" vs "created_at" field issues:**
   If you see errors related to these fields, ensure that the Prisma queries are using the JavaScript property names (camelCase) rather than database column names (snake_case).
   
3. **Missing index.js error:**
   ```
   Could not find a required file. Name: index.js
   ```
   Solution: Make sure your React code is properly organized in the src directory structure:
   ```bash
   # From the frontend directory
   mkdir -p src/{api,components,context,styles}
   # Move files to the correct directories
   mv App.js src/
   mv index.js src/
   # etc.
   ```