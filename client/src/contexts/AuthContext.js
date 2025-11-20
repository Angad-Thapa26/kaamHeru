import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set token in axios headers immediately
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await authAPI.getCurrentUser();
          dispatch({
            type: 'SET_USER',
            payload: response.data.user,
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Only remove token if it's an authentication error
          if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            dispatch({ type: 'SET_USER', payload: null });
          } else {
            // For network/server errors, keep the token and set user to null temporarily
            // The periodic refresh will retry authentication
            dispatch({ type: 'SET_USER', payload: null });
          }
        }
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
    };

    initAuth();
  }, []);

  // Add effect to periodically refresh user data to ensure role consistency
  useEffect(() => {
    // Only run periodic refresh if user has a token AND is not loading
    // This prevents unnecessary auth checks for public users
    if (state.token && !state.loading) {
      const refreshInterval = setInterval(async () => {
        try {
          const response = await authAPI.getCurrentUser();
          // Update last successful auth timestamp
          localStorage.setItem('lastAuthSuccess', Date.now().toString());
          
          if (response.data.user?.role !== state.user?.role) {
            dispatch({
              type: 'SET_USER',
              payload: response.data.user,
            });
          }
        } catch (error) {
          console.error('Auth refresh error:', error);
          // Only logout if it's an authentication error (401/403) AND token is truly expired
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('Token error detected during periodic refresh');
            const lastAuthSuccess = localStorage.getItem('lastAuthSuccess');
            const now = Date.now();
            
            // Only logout if token is truly expired (more than 30 minutes since last success)
            if (!lastAuthSuccess || (now - parseInt(lastAuthSuccess)) > 30 * 60 * 1000) {
              console.log('Token truly expired, logging out...');
              localStorage.removeItem('token');
              localStorage.removeItem('lastAuthSuccess');
              delete api.defaults.headers.common['Authorization'];
              dispatch({ type: 'LOGOUT' });
            } else {
              console.log('Recent auth success found, keeping session active');
            }
          }
          // For other errors (network, server), don't logout - just retry next time
        }
      }, 300000); // 5 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [state.token, state.loading, state.user?.role]);

  // Add visibility change listener to refresh auth when tab becomes active
  useEffect(() => {
    // Only run visibility change listener for authenticated users (has token, not loading)
    // This prevents unnecessary auth checks for public users
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && state.token && !state.loading) {
        // Only refresh auth data if we don't have a user or if enough time has passed
        // This prevents unnecessary API calls and potential logout on tab focus
        if (!state.user || Math.random() < 0.3) { // 30% chance to refresh to reduce server load
          // Refresh auth data when user comes back to the tab
          authAPI.getCurrentUser().then(response => {
            if (response.data.user?.role !== state.user?.role) {
              dispatch({
                type: 'SET_USER',
                payload: response.data.user,
              });
            }
          }).catch(error => {
            console.error('Visibility auth refresh error:', error);
            // Don't logout on visibility change - only on explicit auth errors
            // This prevents logout when tab is unfocused/focused due to temporary issues
            if (error.response?.status === 401 || error.response?.status === 403) {
              console.log('Auth error detected on tab focus, but keeping session active');
              // Only logout if we haven't had a successful auth recently
              // This gives users time to switch between tabs without losing session
              const lastAuthSuccess = localStorage.getItem('lastAuthSuccess');
              const now = Date.now();
              
              // Only logout if token is truly expired (more than 30 minutes since last success)
              if (!lastAuthSuccess || (now - parseInt(lastAuthSuccess)) > 30 * 60 * 1000) {
                console.log('Token truly expired, logging out...');
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
                dispatch({ type: 'LOGOUT' });
              } else {
                console.log('Recent auth success found, keeping session active');
              }
            }
            // For other errors (network, server), do nothing - just retry next time
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state.token, state.loading, state.user?.role]);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authAPI.login(email, password);
      
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('lastAuthSuccess', Date.now().toString()); // Track last successful auth
      
      // Set token in axios defaults for immediate use
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user },
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authAPI.register(userData);
      
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('lastAuthSuccess', Date.now().toString()); // Track last successful auth
      
      // Set token in axios defaults for immediate use
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user },
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      dispatch({ type: 'LOGIN_START' });
      // Redirect to Google OAuth
      authAPI.googleLogin();
    } catch (error) {
      const errorMessage = 'Google login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  const handleGoogleCallback = async (token, user) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authAPI.handleGoogleCallback(token, user);
      
      const userData = response.data.data.user;
      localStorage.setItem('token', token);
      localStorage.setItem('lastAuthSuccess', Date.now().toString()); // Track last successful auth
      
      // Set token in axios defaults for immediate use
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user: userData },
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Google authentication failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastAuthSuccess'); // Clear auth success timestamp
    delete api.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => {
    dispatch({
      type: 'SET_USER',
      payload: { ...state.user, ...userData },
    });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    loginWithGoogle,
    handleGoogleCallback,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
