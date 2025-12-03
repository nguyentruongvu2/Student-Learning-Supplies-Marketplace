# Environment Variables Guide

## Backend Configuration

### Database

- `MONGODB_URI`: MongoDB connection string
  - Default: `mongodb://localhost:27017/student-marketplace`
  - Production: `mongodb+srv://username:password@cluster.mongodb.net/db-name`

### Server

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

### JWT

- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRE`: Token expiration time (default: 7d)

### Email Configuration

- `EMAIL_HOST`: SMTP host (e.g., smtp.gmail.com)
- `EMAIL_PORT`: SMTP port (default: 587)
- `EMAIL_USER`: Email address to send from
- `EMAIL_PASSWORD`: Email password or app password
- `EMAIL_FROM`: Display email address

### Client Configuration

- `FRONTEND_URL`: Frontend URL for CORS and email links
  - Localhost (same machine): `http://localhost:3000`
  - LAN (different machines): `http://192.168.x.x:3000` (replace with your IP)
  - **Important**: When using LAN IP, frontend must also use `REACT_APP_API_URL=http://192.168.x.x:5000`

### File Upload

- `CLOUDINARY_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## Frontend Configuration

### API Base URL

- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Setup Instructions

1. Copy `.env.example` to `.env`
2. Update all values with your configuration
3. For Gmail:
   - Enable "Less secure app access" or
   - Use "App Password" with 2FA enabled
