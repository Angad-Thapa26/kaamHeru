# KaamHeru Setup Guide

## Prerequisites

Before setting up KaamHeru, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**
- **Git**

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kaamheru
```

### 2. Install Dependencies

Install all dependencies for both client and server:

```bash
npm run install-all
```

Or manually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

#### Server Configuration

1. Copy the server environment file:
```bash
cd server
cp .env.example .env
```

2. Edit the `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/kaamheru

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5000000

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

#### Client Configuration

1. Copy the client environment file:
```bash
cd client
cp .env.example .env
```

2. Edit the `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_UPLOAD_URL=http://localhost:5000/uploads
REACT_APP_NAME=KaamHeru
REACT_APP_VERSION=1.0.0
```

### 4. Database Setup

Make sure MongoDB is running on your system:

- **Windows**: Start MongoDB service
- **macOS**: `brew services start mongodb-community`
- **Linux**: `sudo systemctl start mongod`

### 5. Start the Application

#### Development Mode

Start both client and server concurrently:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend app on `http://localhost:3000`

#### Manual Start

Or start them separately:

```bash
# Start server
cd server
npm run dev

# In another terminal, start client
cd client
npm start
```

### 6. Create Initial Admin User

After starting the application:

1. Navigate to `http://localhost:3000/register`
2. Create an account with role "admin"
3. Use the admin credentials to access the admin dashboard

## Default Municipalities

The system comes pre-configured with the following Nepalese municipalities:
- Bharatpur
- Ratnanagar
- Kawasoti
- Gaindakot
- Madhyabindu
- Bharatpur Metropolitain
- Ratnanagar Municipality
- Kawasoti Municipality
- Gaindakot Municipality
- Madhyabindu Municipality

## Project Categories

Available project categories:
- Road Construction
- Building Construction
- Water Supply
- Sanitation
- Electricity
- Education
- Health
- Agriculture
- Tourism
- Other

## File Upload Configuration

- **Maximum file size**: 5MB (configurable via `MAX_FILE_SIZE`)
- **Supported formats**: JPG, JPEG, PNG, GIF
- **Upload location**: `./uploads` directory in server

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `GET /api/users/contractors` - Get all contractors

### Reviews
- `GET /api/reviews/project/:projectId` - Get project reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id/respond` - Respond to review (contractor)
- `PUT /api/reviews/:id/verify` - Verify review (admin)

### Updates
- `GET /api/updates/project/:projectId` - Get project updates
- `POST /api/updates` - Create update
- `PUT /api/updates/:id` - Update update
- `DELETE /api/updates/:id` - Delete update

### File Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the `MONGODB_URI` in server `.env` file
   - Verify MongoDB is accessible on the specified port

2. **CORS Errors**
   - Check `CLIENT_URL` in server `.env` file
   - Ensure it matches your frontend URL

3. **JWT Authentication Issues**
   - Verify `JWT_SECRET` is set in server `.env`
   - Check token is being stored in localStorage

4. **File Upload Issues**
   - Ensure `uploads` directory exists and is writable
   - Check file size limits
   - Verify supported file formats

5. **Port Conflicts**
   - Change `PORT` in server `.env` if 5000 is in use
   - React will automatically find an available port for 3000

### Development Tips

- Use `npm run dev` for concurrent development
- Check browser console for frontend errors
- Check server terminal for backend errors
- Use MongoDB Compass for database visualization
- Test API endpoints with Postman or similar tools

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in server `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper MongoDB connection string
4. Set up reverse proxy (nginx/Apache)
5. Configure SSL certificates
6. Set up proper file storage (AWS S3, etc.)
7. Configure environment variables properly
8. Build React app: `npm run build` in client directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Check the troubleshooting section
- Review the API documentation
- Check the GitHub issues page
- Contact the development team
