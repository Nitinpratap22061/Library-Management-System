import React, { useContext, useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Badge,
  Tooltip,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  LocalLibrary,
  Book,
  Bookmark,
  ExitToApp,
  PersonAdd,
  Login,
  Home,
  AddBox,
  SupervisorAccount,
  Send,
  Person,
  Logout,
  School,
  Brightness4,
  Brightness7,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ThemeContext } from '../App';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { toggleColorMode, mode } = useContext(ThemeContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleUserMenuClose();
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  // Generate gradient background colors based on user name
  const generateAvatarGradient = (name) => {
    if (!name) return 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)';
    
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const hue1 = hash % 360;
    const hue2 = (hash * 1.5) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 80%, 55%), hsl(${hue2}, 80%, 45%))`;
  };

  const menuItems = [
    { 
      text: 'Home', 
      path: '/', 
      icon: <Home />, 
      authorized: true,
      roles: ['admin', 'student']
    },
    { 
      text: 'My Requests', 
      path: '/my-requests', 
      icon: <Send />, 
      authorized: true,
      roles: ['student']
    },
    { 
      text: 'My Books', 
      path: '/my-books', 
      icon: <Bookmark />, 
      authorized: true,
      roles: ['student']
    },
    { 
      text: 'Book Requests', 
      path: '/book-requests', 
      icon: <SupervisorAccount />, 
      authorized: true,
      roles: ['admin']
    },
    { 
      text: 'All Issues', 
      path: '/all-issues', 
      icon: <Book />, 
      authorized: true,
      roles: ['admin']
    },
    { 
      text: 'Add Book', 
      path: '/add-book', 
      icon: <AddBox />, 
      authorized: true,
      roles: ['admin']
    },
    { 
      text: 'Login', 
      path: '/login', 
      icon: <Login />, 
      authorized: false
    },
    { 
      text: 'Register', 
      path: '/register', 
      icon: <PersonAdd />, 
      authorized: false
    }
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box 
        sx={{ 
          height: 170, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
            : 'linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            opacity: theme.palette.mode === 'dark' ? 0.2 : 0.3,
            zIndex: 0 
          }} 
        />
        <LocalLibrary 
          fontSize="large" 
          sx={{ 
            color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main', 
            fontSize: '3rem', 
            mb: 1, 
            filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.2))',
            zIndex: 1
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            textAlign: 'center',
            color: theme.palette.mode === 'dark' ? '#90caf9' : '#1a237e',
            textShadow: theme.palette.mode === 'dark' 
              ? '0 1px 2px rgba(0,0,0,0.5)'
              : '0 1px 2px rgba(255,255,255,0.5)',
            zIndex: 1
          }}
        >
          Library System
        </Typography>
        {isAuthenticated && user && (
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 0.5, 
              color: theme.palette.mode === 'dark' ? 'text.primary' : 'text.secondary',
              fontWeight: 500,
              zIndex: 1
            }}
          >
            Welcome, {user.name}
          </Typography>
        )}
      </Box>
      
      <Divider />
      
      <List sx={{ py: 2 }}>
        {menuItems.map((item) => {
          // Skip items that don't match authentication state
          if (item.authorized !== isAuthenticated) return null;
          
          // Skip items that require specific roles
          if (item.roles && (!user || !item.roles.includes(user.role))) return null;
          
          return (
            <ListItem 
              button 
              key={item.text}
              component={Link}
              to={item.path}
              onClick={() => setDrawerOpen(false)}
              sx={{ 
                borderRadius: '0 20px 20px 0',
                ml: 1,
                mb: 1,
                bgcolor: location.pathname === item.path 
                  ? alpha(theme.palette.primary.main, 0.08)
                  : 'transparent',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.12)
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 'bold' : 'regular' 
                }}
              />
            </ListItem>
          );
        })}
        
        {/* Theme toggle button in drawer */}
        <ListItem 
          button 
          onClick={toggleColorMode}
          sx={{ 
            borderRadius: '0 20px 20px 0',
            ml: 1,
            mb: 1
          }}
        >
          <ListItemIcon>
            {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
          </ListItemIcon>
          <ListItemText 
            primary={theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'} 
          />
        </ListItem>
      </List>
      
      {isAuthenticated && (
        <>
          <Divider />
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{ 
              borderRadius: '0 20px 20px 0',
              ml: 1,
              mt: 1
            }}
          >
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      )}
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0}
      sx={{ 
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'background.default',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          {/* Mobile menu button */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { md: 'none' } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            <LocalLibrary 
              sx={{ 
                color: 'primary.main', 
                mr: 1.5, 
                fontSize: '1.8rem'
              }} 
            />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              LIBRARY
            </Typography>
          </Box>
          
          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 3 }}>
            {/* Home link always visible */}
            <Button
              component={Link}
              to="/"
              sx={{ 
                my: 2, 
                color: 'text.primary', 
                display: 'flex', 
                alignItems: 'center',
                bgcolor: location.pathname === '/' ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.12)
                }
              }}
            >
              <Home sx={{ mr: 0.5, fontSize: '1.2rem' }} />
              Books
            </Button>
            
            {isAuthenticated && user?.role === 'student' && (
              <>
                <Button
                  component={Link}
                  to="/my-requests"
                  sx={{ 
                    my: 2, 
                    color: 'text.primary', 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: location.pathname === '/my-requests' ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12)
                    }
                  }}
                >
                  <Send sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                  My Requests
                </Button>
                <Button
                  component={Link}
                  to="/my-books"
                  sx={{ 
                    my: 2, 
                    color: 'text.primary', 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: location.pathname === '/my-books' ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12)
                    }
                  }}
                >
                  <Bookmark sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                  My Books
                </Button>
              </>
            )}
            
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Button
                  component={Link}
                  to="/book-requests"
                  sx={{ 
                    my: 2, 
                    color: 'text.primary', 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: location.pathname === '/book-requests' ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12)
                    }
                  }}
                >
                  <SupervisorAccount sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                  Requests
                </Button>
                <Button
                  component={Link}
                  to="/all-issues"
                  sx={{ 
                    my: 2, 
                    color: 'text.primary', 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: location.pathname === '/all-issues' ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12)
                    }
                  }}
                >
                  <Book sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                  Issues
                </Button>
                <Button
                  component={Link}
                  to="/add-book"
                  sx={{ 
                    my: 2, 
                    color: 'text.primary', 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: location.pathname === '/add-book' ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12)
                    }
                  }}
                >
                  <AddBox sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                  Add Book
                </Button>
              </>
            )}
          </Box>
          
          {/* Theme toggle button */}
          <IconButton 
            onClick={toggleColorMode} 
            color="inherit"
            sx={{ ml: 1 }}
          >
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          
          {/* Auth buttons or user menu */}
          <Box sx={{ ml: 2 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title={user?.name || 'User'}>
                  <IconButton 
                    onClick={handleUserMenuOpen}
                    size="small"
                    edge="end"
                    aria-haspopup="true"
                  >
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        background: generateAvatarGradient(user?.name)
                      }}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : <Person />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    elevation: 3,
                    sx: { 
                      mt: 1.5, 
                      width: 220,
                      borderRadius: 2,
                      overflow: 'visible',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {user?.email}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1, 
                        bgcolor: user?.role === 'admin' ? 'primary.light' : 'success.light',
                        color: user?.role === 'admin' ? 'primary.dark' : 'success.dark',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '0.65rem'
                      }}
                    >
                      {user?.role}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <Button 
                  component={Link}
                  to="/login"
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>
                <Button 
                  component={Link}
                  to="/register"
                  color="primary"
                  variant="contained"
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 