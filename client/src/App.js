import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ProjectsList from './pages/Projects/ProjectsList';
import ProjectDetail from './pages/Projects/ProjectDetail';
import Profile from './pages/Profile/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ContractorDashboard from './pages/Contractor/ContractorDashboard';
import LoadingSpinner from './components/UI/LoadingSpinner';
import DebugPanel from './pages/Debug/DebugPanel';
import PublicReviews from './pages/Reviews/PublicReviews';
import ContractorReviews from './pages/Reviews/ContractorReviews';
import AdminReviews from './pages/Reviews/AdminReviews';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        {/* Debug Route */}
        <Route path="/debug" element={<DebugPanel />} />
        
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes with global Layout (Header + Sidebar) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="reviews" element={user ? <PublicReviews /> : <Navigate to="/login" />} />
          {/* Contractor Routes nested to keep nav bar */}
          <Route 
            path="contractor/*" 
            element={user?.role === 'contractor' ? <ContractorDashboard /> : <Navigate to="/dashboard" />} 
          />
        </Route>
        
        {/* Admin Routes - Use separate AdminLayout (left as-is) */}
        <Route 
          path="admin/*" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Box>
  );
}

export default App;
