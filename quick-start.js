#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 KaamHeru Quick Start Setup');
console.log('================================\n');

// Check if Node.js is installed
try {
  execSync('node --version', { stdio: 'pipe' });
  console.log('✅ Node.js is installed');
} catch (error) {
  console.log('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Check if MongoDB is running (basic check)
try {
  execSync('mongosh --eval "db.runCommand({ping: 1})"', { stdio: 'pipe' });
  console.log('✅ MongoDB is running');
} catch (error) {
  console.log('⚠️  MongoDB might not be running. Please ensure MongoDB is installed and running.');
}

// Create .env files if they don't exist
const serverEnvPath = path.join(__dirname, 'server', '.env');
const clientEnvPath = path.join(__dirname, 'client', '.env');

if (!fs.existsSync(serverEnvPath)) {
  console.log('📝 Creating server .env file...');
  fs.copyFileSync(path.join(__dirname, 'server', '.env.example'), serverEnvPath);
  console.log('✅ Server .env file created');
} else {
  console.log('✅ Server .env file already exists');
}

if (!fs.existsSync(clientEnvPath)) {
  console.log('📝 Creating client .env file...');
  fs.copyFileSync(path.join(__dirname, 'client', '.env.example'), clientEnvPath);
  console.log('✅ Client .env file created');
} else {
  console.log('✅ Client .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Installing server dependencies...');
  execSync('cd server && npm install', { stdio: 'inherit' });
  
  console.log('Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });
  
  console.log('✅ All dependencies installed successfully');
} catch (error) {
  console.log('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Create uploads directory
const uploadsDir = path.join(__dirname, 'server', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Uploads directory created');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\nNext steps:');
console.log('1. Start MongoDB if not already running');
console.log('2. Run "npm run dev" to start both client and server');
console.log('3. Open http://localhost:3000 in your browser');
console.log('4. Register an account to get started');
console.log('\n📚 For detailed instructions, see SETUP.md');
console.log('📖 For API documentation, see API_DOCUMENTATION.md');
