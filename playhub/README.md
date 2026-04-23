# PlayHub - Free Game Upload and Play Website

A full-stack web application for uploading and playing free HTML5 games, built as a term project for SE3542 Web Engineering.

## Features

- User registration and login
- Upload HTML5 games (for logged-in users)
- Browse and play games (public access)
- Responsive Bootstrap UI
- Node.js backend with Express
- MongoDB database
- File upload with Multer

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: HTML5, CSS3, Bootstrap 5, EJS
- **Authentication**: Express sessions, bcrypt
- **File Upload**: Multer

## Setup Instructions

1. **Prerequisites**:
   - Node.js installed
   - MongoDB installed and running

2. **Clone or Download** the project.

3. **Install Dependencies**:
   ```
   npm install
   ```

4. **Environment Variables**:
   - Update `.env` file with your MongoDB URI and secrets.

5. **Start MongoDB** (if not running):
   - On Windows: `mongod` or start MongoDB service.

6. **Run the Application**:
   ```
   npm start
   ```

7. **Access the App**:
   - Open browser to `http://localhost:3000`

## Usage

- Register a new account or login.
- Browse available games on the home page.
- Logged-in users can upload games by providing title, description, and HTML file.
- Click "Play" to play any game in an iframe.

## Project Structure

- `app.js`: Main server file
- `models/`: Mongoose models (User, Game)
- `routes/`: Express routes (auth, games)
- `views/`: EJS templates
- `public/`: Static files (CSS, JS, uploaded games)
- `middleware/`: Authentication middleware

## API Endpoints

- `GET /`: Home page
- `POST /auth/register`: Register user
- `POST /auth/login`: Login user
- `GET /auth/logout`: Logout
- `GET /games`: List games
- `POST /games/upload`: Upload game (auth required)
- `GET /games/:id/play`: Play game

## Security Notes

- Passwords are hashed with bcrypt.
- Sessions are used for authentication.
- Uploaded files are stored in `public/games/` directory.

## Future Enhancements

- Add game categories/tags
- User profiles and game ratings
- Admin panel for moderation
- Support for more file types (ZIP archives)
- Real-time features with Socket.io

## License

This project is for educational purposes.