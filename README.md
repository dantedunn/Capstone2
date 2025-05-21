# Video Game Review Site

This project is a React application that serves as a video game review website. It allows users to browse video games, view detailed information about each game, and submit reviews.

## Features

- Fetches video game data from the IGDB API.
- Displays a list of video games.
- Shows detailed information about selected games.
- Allows users to submit reviews for games.

## Project Structure

```
video-game-review-site
├── public
│   ├── index.html        # Main HTML file
│   └── favicon.ico       # Favicon for the website
├── src
│   ├── api
│   │   └── api.js       # API functions for fetching game data
│   ├── components
│   │   ├── GameList.js   # Component for listing games
│   │   ├── GameDetail.js  # Component for game details
│   │   └── ReviewForm.js  # Component for submitting reviews
│   ├── App.js            # Main application component
│   ├── index.js          # Entry point for the React application
│   └── styles
│       └── App.css       # CSS styles for the application
├── package.json          # npm configuration file
└── README.md             # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd video-game-review-site
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

## API Integration

This application uses the IGDB API to fetch video game data. Make sure to replace the placeholder values for `Client-ID` and `Authorization` in the `src/api/api.js` file with your actual API credentials.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.