import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    console.log('Initial token from localStorage:', token ? 'Found' : 'Not found');
    if (token) {
      setAuthToken(token);
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Set token to headers
  const setAuthToken = (token) => {
    if (token) {
      console.log('Setting auth token in axios headers');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // For debugging, check if the token is actually set
      setTimeout(() => {
        console.log('Current Authorization header:', axios.defaults.headers.common['Authorization']);
      }, 100);
    } else {
      console.log('Removing auth token from axios headers');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user information
  const loadUser = async () => {
    try {
      console.log('Loading user profile...');
      const res = await axios.get('http://localhost:5000/api/auth/profile');
      console.log('User profile loaded:', res.data);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error loading user:', err);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  // Register user
  const register = async (userData) => {
    try {
      console.log('Registering user:', userData.email);
      await axios.post('http://localhost:5000/api/auth/register', userData);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      console.log('Logging in user:', userData.email);
      const res = await axios.post('http://localhost:5000/api/auth/login', userData);
      
      console.log('Login successful, setting token');
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Logout user
  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 