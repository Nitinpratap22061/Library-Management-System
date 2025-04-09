import React, { useContext, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';

// Context
import AuthContext, { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import BooksList from './pages/BooksList';
import AddBook from './pages/AddBook';
import MyBooks from './pages/MyBooks';
import AllIssues from './pages/AllIssues';
import BookRequests from './pages/BookRequests';
import MyRequests from './pages/MyRequests';

// Create a theme context to manage theme state
export const ThemeContext = React.createContext({
  toggleColorMode: () => {},
  mode: 'light',
});

// Custom route for student-only access
const StudentRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'student') {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  // State to manage theme mode
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

  // Theme toggle function
  const themeContext = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  // Create theme based on current mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#3B82F6' : '#2563EB',
            light: mode === 'dark' ? '#60A5FA' : '#60A5FA',
            dark: mode === 'dark' ? '#1E40AF' : '#1E40AF',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: mode === 'dark' ? '#A855F7' : '#9333EA',
            light: mode === 'dark' ? '#C084FC' : '#C084FC',
            dark: mode === 'dark' ? '#6B21A8' : '#6B21A8',
            contrastText: '#FFFFFF',
          },
          success: {
            main: mode === 'dark' ? '#10B981' : '#10B981',
            light: mode === 'dark' ? '#6EE7B7' : '#A7F3D0',
            dark: mode === 'dark' ? '#065F46' : '#065F46',
          },
          error: {
            main: mode === 'dark' ? '#EF4444' : '#EF4444',
            light: mode === 'dark' ? '#FCA5A5' : '#FEE2E2',
            dark: mode === 'dark' ? '#B91C1C' : '#B91C1C',
          },
          warning: {
            main: mode === 'dark' ? '#F59E0B' : '#F59E0B',
            light: mode === 'dark' ? '#FCD34D' : '#FEF3C7',
            dark: mode === 'dark' ? '#B45309' : '#B45309',
          },
          info: {
            main: mode === 'dark' ? '#3B82F6' : '#3B82F6',
            light: mode === 'dark' ? '#93C5FD' : '#DBEAFE',
            dark: mode === 'dark' ? '#1E40AF' : '#1E40AF',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#F8FAFC',
            paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
          },
          text: {
            primary: mode === 'dark' ? '#E2E8F0' : '#1E293B',
            secondary: mode === 'dark' ? '#94A3B8' : '#64748B',
            disabled: mode === 'dark' ? '#64748B' : '#94A3B8',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          fontWeightLight: 300,
          fontWeightRegular: 400,
          fontWeightMedium: 500,
          fontWeightBold: 700,
          h1: {
            fontWeight: 800,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          },
          h2: {
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          },
          h3: {
            fontWeight: 700,
            fontSize: '1.75rem',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          },
          h4: {
            fontWeight: 700,
            fontSize: '1.5rem',
            lineHeight: 1.35,
          },
          h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.4,
          },
          h6: {
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.5,
          },
          subtitle1: {
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: 1.5,
            letterSpacing: '0.01em',
          },
          subtitle2: {
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.5,
            letterSpacing: '0.01em',
          },
          body1: {
            fontWeight: 400,
            fontSize: '1rem',
            lineHeight: 1.5,
          },
          body2: {
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.5,
          },
          button: {
            fontWeight: 600,
            fontSize: '0.875rem',
            letterSpacing: '0.01em',
            textTransform: 'none',
          },
        },
        shape: {
          borderRadius: 12,
        },
        shadows: 
          mode === 'dark' 
            ? [
                'none',
                '0px 2px 4px rgba(0, 0, 0, 0.2), 0px 1px 2px rgba(0, 0, 0, 0.3)',
                '0px 3px 6px rgba(0, 0, 0, 0.25), 0px 2px 4px rgba(0, 0, 0, 0.35)',
                '0px 4px 8px rgba(0, 0, 0, 0.3), 0px 2px 4px rgba(0, 0, 0, 0.4)',
                '0px 6px 12px rgba(0, 0, 0, 0.35), 0px 3px 5px rgba(0, 0, 0, 0.45)',
                '0px 8px 16px rgba(0, 0, 0, 0.4), 0px 4px 6px rgba(0, 0, 0, 0.5)',
                '0px 12px 24px rgba(0, 0, 0, 0.45), 0px 5px 10px rgba(0, 0, 0, 0.55)',
                '0px 16px 32px rgba(0, 0, 0, 0.5), 0px 8px 16px rgba(0, 0, 0, 0.6)',
                '0px 20px 40px rgba(0, 0, 0, 0.55), 0px 10px 20px rgba(0, 0, 0, 0.65)',
                '0px 24px 48px rgba(0, 0, 0, 0.6), 0px 12px 24px rgba(0, 0, 0, 0.7)',
                '0px 28px 56px rgba(0, 0, 0, 0.65), 0px 14px 28px rgba(0, 0, 0, 0.75)',
                '0px 32px 64px rgba(0, 0, 0, 0.7), 0px 16px 32px rgba(0, 0, 0, 0.8)',
                '0px 36px 72px rgba(0, 0, 0, 0.75), 0px 18px 36px rgba(0, 0, 0, 0.85)',
                '0px 40px 80px rgba(0, 0, 0, 0.8), 0px 20px 40px rgba(0, 0, 0, 0.9)',
                '0px 44px 88px rgba(0, 0, 0, 0.85), 0px 22px 44px rgba(0, 0, 0, 0.95)',
                '0px 48px 96px rgba(0, 0, 0, 0.9), 0px 24px 48px rgba(0, 0, 0, 1)',
                '0px 52px 104px rgba(0, 0, 0, 0.95), 0px 26px 52px rgba(0, 0, 0, 1)',
                '0px 56px 112px rgba(0, 0, 0, 1), 0px 28px 56px rgba(0, 0, 0, 1)',
                '0px 60px 120px rgba(0, 0, 0, 1), 0px 30px 60px rgba(0, 0, 0, 1)',
                '0px 64px 128px rgba(0, 0, 0, 1), 0px 32px 64px rgba(0, 0, 0, 1)',
                '0px 68px 136px rgba(0, 0, 0, 1), 0px 34px 68px rgba(0, 0, 0, 1)',
                '0px 72px 144px rgba(0, 0, 0, 1), 0px 36px 72px rgba(0, 0, 0, 1)',
                '0px 76px 152px rgba(0, 0, 0, 1), 0px 38px 76px rgba(0, 0, 0, 1)',
                '0px 80px 160px rgba(0, 0, 0, 1), 0px 40px 80px rgba(0, 0, 0, 1)',
              ]
            : [
                'none',
                '0px 2px 4px rgba(0, 0, 0, 0.03), 0px 1px 2px rgba(0, 0, 0, 0.05)',
                '0px 3px 6px rgba(0, 0, 0, 0.04), 0px 2px 4px rgba(0, 0, 0, 0.06)',
                '0px 4px 8px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.06)',
                '0px 6px 12px rgba(0, 0, 0, 0.06), 0px 3px 5px rgba(0, 0, 0, 0.07)',
                '0px 8px 16px rgba(0, 0, 0, 0.07), 0px 4px 6px rgba(0, 0, 0, 0.08)',
                '0px 12px 24px rgba(0, 0, 0, 0.08), 0px 5px 10px rgba(0, 0, 0, 0.09)',
                '0px 16px 32px rgba(0, 0, 0, 0.09), 0px 8px 16px rgba(0, 0, 0, 0.10)',
                '0px 20px 40px rgba(0, 0, 0, 0.10), 0px 10px 20px rgba(0, 0, 0, 0.11)',
                '0px 24px 48px rgba(0, 0, 0, 0.11), 0px 12px 24px rgba(0, 0, 0, 0.12)',
                '0px 28px 56px rgba(0, 0, 0, 0.12), 0px 14px 28px rgba(0, 0, 0, 0.13)',
                '0px 32px 64px rgba(0, 0, 0, 0.13), 0px 16px 32px rgba(0, 0, 0, 0.14)',
                '0px 36px 72px rgba(0, 0, 0, 0.14), 0px 18px 36px rgba(0, 0, 0, 0.15)',
                '0px 40px 80px rgba(0, 0, 0, 0.15), 0px 20px 40px rgba(0, 0, 0, 0.16)',
                '0px 44px 88px rgba(0, 0, 0, 0.16), 0px 22px 44px rgba(0, 0, 0, 0.17)',
                '0px 48px 96px rgba(0, 0, 0, 0.17), 0px 24px 48px rgba(0, 0, 0, 0.18)',
                '0px 52px 104px rgba(0, 0, 0, 0.18), 0px 26px 52px rgba(0, 0, 0, 0.19)',
                '0px 56px 112px rgba(0, 0, 0, 0.19), 0px 28px 56px rgba(0, 0, 0, 0.20)',
                '0px 60px 120px rgba(0, 0, 0, 0.20), 0px 30px 60px rgba(0, 0, 0, 0.21)',
                '0px 64px 128px rgba(0, 0, 0, 0.21), 0px 32px 64px rgba(0, 0, 0, 0.22)',
                '0px 68px 136px rgba(0, 0, 0, 0.22), 0px 34px 68px rgba(0, 0, 0, 0.23)',
                '0px 72px 144px rgba(0, 0, 0, 0.23), 0px 36px 72px rgba(0, 0, 0, 0.24)',
                '0px 76px 152px rgba(0, 0, 0, 0.24), 0px 38px 76px rgba(0, 0, 0, 0.25)',
                '0px 80px 160px rgba(0, 0, 0, 0.25), 0px 40px 80px rgba(0, 0, 0, 0.26)',
              ],
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: mode === 'dark' ? '#2D3748' : '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: mode === 'dark' ? '#4A5568' : '#c1c1c1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: mode === 'dark' ? '#718096' : '#a8a8a8',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 600,
                boxShadow: 'none',
                textTransform: 'none',
                '&:hover': {
                  boxShadow: mode === 'dark' 
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
              },
              contained: {
                boxShadow: mode === 'dark' 
                  ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
              },
              outlined: {
                borderWidth: '1.5px',
                '&:hover': {
                  borderWidth: '1.5px',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'dark' 
                  ? '0 4px 20px rgba(0, 0, 0, 0.4)' 
                  : '0 4px 20px rgba(0, 0, 0, 0.08)',
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
                border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'dark' 
                  ? '0 2px 8px rgba(0, 0, 0, 0.4)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBottom: mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                  },
                },
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={themeContext}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Navbar />
            <div style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
              <Routes>
                <Route path="/" element={<BooksList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Student Routes */}
                <Route 
                  path="/my-books" 
                  element={
                    <StudentRoute>
                      <MyBooks />
                    </StudentRoute>
                  } 
                />
                
                <Route 
                  path="/my-requests" 
                  element={
                    <StudentRoute>
                      <MyRequests />
                    </StudentRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="/add-book" 
                  element={
                    <PrivateRoute requireAdmin={true}>
                      <AddBook />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/all-issues" 
                  element={
                    <PrivateRoute requireAdmin={true}>
                      <AllIssues />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/book-requests" 
                  element={
                    <PrivateRoute requireAdmin={true}>
                      <BookRequests />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
