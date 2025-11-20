# KaamHeru Troubleshooting Guide

## 🔧 Registration Failed Error

If you're seeing "Registration failed" popup, here's how to debug:

### Step 1: Check Backend Status

1. Open your browser and go to: `http://localhost:5000/api/health`
2. You should see a JSON response like:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "database": {
       "status": "connected",
       "state": 1
     }
   }
   ```

### Step 2: Use Debug Panel

1. Navigate to: `http://localhost:3000/debug`
2. Check the server health status
3. Test registration with the debug button
4. Review detailed error messages

### Step 3: Common Issues & Solutions

#### ❌ Backend Not Running
**Error**: `ECONNREFUSED` or connection refused

**Solution**:
```bash
# Start the backend server
cd server
npm run dev
```

#### ❌ MongoDB Not Connected
**Error**: Database status shows "disconnected"

**Solution**:
```bash
# Option 1: Start MongoDB service (Windows)
net start MongoDB

# Option 2: Start MongoDB directly
mongod

# Option 3: Use MongoDB Atlas
# Update server/.env with Atlas connection string
```

#### ❌ Environment Variables Missing
**Error**: Validation errors or missing configuration

**Solution**:
```bash
# Check server environment file
cd server
copy .env.example .env

# Edit .env with proper values:
MONGODB_URI=mongodb://localhost:27017/kaamheru
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

#### ❌ Port Already in Use
**Error**: Port 5000 already in use

**Solution**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use different port in .env
PORT=5001
```

#### ❌ CORS Issues
**Error**: CORS policy error in browser console

**Solution**:
- Check `CLIENT_URL` in server/.env matches your frontend URL
- Default should be: `CLIENT_URL=http://localhost:3000`

#### ❌ Validation Errors
**Error**: Registration form validation fails

**Common validation rules**:
- Username: minimum 3 characters
- Email: valid email format
- Password: minimum 6 characters
- Full Name: required
- Municipality: must be from the allowed list

### Step 4: Check Browser Console

1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check Network tab for failed requests

### Step 5: Test API Directly

You can test the registration endpoint directly:

```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "municipality": "Bharatpur",
    "role": "public"
  }'
```

### Step 6: Check Server Logs

Look at the terminal where your server is running for error messages:
- MongoDB connection errors
- Validation errors
- Server startup errors

## 🚀 Quick Start Checklist

- [ ] MongoDB is running
- [ ] Backend server started (`npm run dev` from server directory)
- [ ] Frontend server started (`npm start` from client directory)
- [ ] Environment files configured (.env in both server and client)
- [ ] No port conflicts (3000 for frontend, 5000 for backend)
- [ ] CORS properly configured

## 📞 Still Having Issues?

If you're still experiencing problems:

1. **Check the debug panel** at `http://localhost:3000/debug`
2. **Review server logs** in the backend terminal
3. **Check browser console** for JavaScript errors
4. **Verify all dependencies** are installed (`npm run install-all`)
5. **Restart both servers** after configuration changes

## 🔍 Advanced Debugging

### Check MongoDB Connection
```javascript
// In server terminal
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/kaamheru')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));
"
```

### Test Individual API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456","fullName":"Test","municipality":"Bharatpur"}'
```

### Check Environment Variables
```bash
# In server directory
node -e "console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');"
```

---

This guide should help you resolve most registration issues. The debug panel provides real-time diagnostics to identify the specific problem.
