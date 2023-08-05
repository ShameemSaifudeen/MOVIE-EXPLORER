# MOVIE-EXPLORER

A web application for creating and managing movie playlists. Users can create public playlists that are visible to all users, or private playlists that are only visible to them. They can add movies to the playlists, view all the playlists and their contents, and search for movies using the Open Movie Database (OMDB) API.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- OMDB API Key (get it from http://www.omdbapi.com/apikey.aspx)

### Installing

1. Clone the repository
2. Install dependencies
3. Create a `.env` file in the root directory and add the following: 
   Replace `your_omdb_api_key` with the actual OMDB API key you received.
4. Run the application


## Features

- User Authentication: Sign Up, Log In, Log Out
- Playlist Management: Create public and private playlists, add movies to playlists, view playlists
- Movie Search: Search for movies using the OMDB API. Access the search feature at the `/search/:title` route, where `:title` is the title of the movie you're searching for.

## Built With

- Node.js - JavaScript runtime
- Express - Web application framework
- MongoDB - Database
- bcrypt - Library to hash passwords
- Express Session - Session middleware
- OMDB API - Movie information and search

## Author

- Muhammed Shameem S
