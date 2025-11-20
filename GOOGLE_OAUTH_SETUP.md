# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for KaamHeru.

## Prerequisites

- Google Cloud Platform account
- Access to Google Console
- Your application's domain (for production)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top
4. Click "NEW PROJECT"
5. Enter a project name (e.g., "KaamHeru")
6. Click "CREATE"

## Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "People API"
3. Click on it and click "ENABLE"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "+ CREATE CREDENTIALS" > "OAuth client ID"
3. If prompted, configure the "OAuth consent screen" first:
   - Choose "External" (unless you're a Google Workspace user)
   - Fill in required fields:
     - App name: "KaamHeru"
     - User support email: your email
     - Developer contact information: your email
   - Click "SAVE AND CONTINUE"
   - Add scopes (click "ADD OR REMOVE SCOPES"):
     - `email`
     - `profile`
     - `openid`
   - Click "SAVE AND CONTINUE"
   - Add test users (your email for testing)
   - Click "SAVE AND CONTINUE"

4. Now create the OAuth client ID:
   - Application type: "Web application"
   - Name: "KaamHeru Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (development)
     - `https://your-api-domain.com/api/auth/google/callback` (production)
   - Click "CREATE"

## Step 4: Get Your Credentials

After creating the OAuth client, you'll see:
- **Client ID**: Copy this value
- **Client Secret**: Copy this value

## Step 5: Configure Environment Variables

### Development Environment

1. Copy the server environment file:
```bash
cd server
cp .env.example .env
```

2. Edit the `.env` file and add your Google credentials:
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session Configuration
SESSION_SECRET=your_session_secret_here_change_in_production
```

### Production Environment

For production, update the values:
```env
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
GOOGLE_CALLBACK_URL=https://your-api-domain.com/api/auth/google/callback
```

## Step 6: Install Dependencies

If you haven't already, install the required packages:
```bash
cd server
npm install passport passport-google-oauth20 express-session
```

## Step 7: Test the Configuration

1. Start your application:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000/login`
3. Click "Continue with Google"
4. You should be redirected to Google's consent screen
5. After authorization, you'll be redirected back to your application

## Common Issues and Solutions

### 1. "redirect_uri_mismatch" Error

**Problem**: The redirect URI in your Google Console doesn't match the one in your application.

**Solution**: 
- Check your `.env` file for `GOOGLE_CALLBACK_URL`
- Make sure it exactly matches the URI in Google Console
- Include the protocol (http/https) and port number

### 2. "invalid_client" Error

**Problem**: The client ID or secret is incorrect.

**Solution**:
- Double-check your `.env` file
- Copy the values directly from Google Console
- Make sure there are no extra spaces or characters

### 3. CORS Issues

**Problem**: Frontend can't access the Google OAuth endpoint.

**Solution**:
- Make sure your `CLIENT_URL` in `.env` matches your frontend URL
- Check that CORS is properly configured in `server.js`

### 4. Session Issues

**Problem**: User gets logged out immediately after login.

**Solution**:
- Check your `SESSION_SECRET` is set
- Make sure session middleware is properly configured
- For production, ensure `secure: true` in session cookie

## Production Considerations

### 1. HTTPS Required
Google OAuth requires HTTPS in production. Make sure:
- Your frontend uses HTTPS
- Your API uses HTTPS
- Update all URLs in Google Console to use HTTPS

### 2. Domain Verification
For production, you should:
- Verify your domain in Google Console
- Add your domain to authorized JavaScript origins
- Use a professional email for user support

### 3. Security Best Practices
- Use a strong `SESSION_SECRET`
- Rotate your client secret periodically
- Monitor your OAuth usage in Google Console
- Implement proper error handling

## Testing Checklist

- [ ] Google OAuth flow works in development
- [ ] User is created/linked correctly in database
- [ ] JWT token is generated and stored
- [ ] User is redirected to dashboard after login
- [ ] Profile data is populated from Google
- [ ] Logout works correctly
- [ ] Error handling works for failed authentication

## Next Steps

After setting up Google OAuth:

1. Test the complete authentication flow
2. Handle profile completion for OAuth users
3. Add additional OAuth providers if needed (Facebook, GitHub, etc.)
4. Implement proper session management
5. Add analytics for authentication methods

## Support

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Check the server logs for authentication errors
3. Verify all environment variables are set correctly
4. Ensure Google Console configuration matches your application
5. Review the Google OAuth documentation for any API changes

---

For more information, visit:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
