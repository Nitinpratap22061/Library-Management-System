import React, { useContext, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Grid, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Box,
  Avatar,
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import { Delete, ExpandMore, ExpandLess } from '@mui/icons-material';
import AuthContext from '../context/AuthContext';
import { requestBook, deleteBook } from '../utils/api';

const BookItem = ({ book, onDelete, onRequest }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Get first letter of book title for avatar
  const bookInitial = book.title.charAt(0).toUpperCase();

  // Generate gradient background colors based on book title
  const generateGradient = (title) => {
    const hash = title.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const hue1 = hash % 360;
    const hue2 = (hash * 1.5) % 360;
    
    if (theme.palette.mode === 'dark') {
      return `linear-gradient(135deg, hsla(${hue1}, 80%, 40%, 0.95), hsla(${hue2}, 85%, 35%, 1))`;
    }
    return `linear-gradient(135deg, hsla(${hue1}, 90%, 60%, 0.95), hsla(${hue2}, 95%, 50%, 1))`;
  };

  const handleRequestBook = async () => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'You need to be logged in to request books',
        severity: 'warning'
      });
      return;
    }
    
    try {
      setLoading(true);
      await requestBook(book._id);
      
      setSnackbar({
        open: true,
        message: 'Book request sent successfully!',
        severity: 'success'
      });
      onRequest && onRequest(book._id);
    } catch (error) {
      console.error('Error requesting book:', error);
      let errorMessage = 'Failed to request book. Please try again.';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated || user?.role !== 'admin') return;
    
    try {
      setLoading(true);
      await deleteBook(book._id);
      setSnackbar({
        open: true,
        message: 'Book deleted successfully!',
        severity: 'success'
      });
      onDelete && onDelete(book._id);
    } catch (error) {
      console.error('Error deleting book:', error);
      let errorMessage = 'Failed to delete book. Please try again.';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Card 
        sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#fff',
          color: theme.palette.mode === 'dark' ? 'white' : '#333',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 10px 20px rgba(0, 0, 0, 0.3)' 
            : '0 10px 20px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-12px)',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 22px 40px rgba(0, 0, 0, 0.4)' 
              : '0 22px 40px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <Box 
          sx={{ 
            width: '100%',
            height: '200px',
            background: generateGradient(book.title),
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at top right, rgba(255,255,255,0.3), transparent 70%)',
              zIndex: 1
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '150%',
              height: '150%',
              top: '-25%',
              left: '-25%',
              background: 'radial-gradient(circle at bottom left, rgba(0,0,0,0.1), transparent 70%)',
              zIndex: 0
            }
          }}
        >
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: 'white',
              color: '#333',
              fontSize: '2.2rem',
              fontWeight: 'bold',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '4px solid rgba(255, 255, 255, 0.9)',
              zIndex: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            {bookInitial}
          </Avatar>
          
          {user?.role === 'admin' && (
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                bgcolor: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(4px)',
                color: 'white',
                zIndex: 5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(220, 0, 0, 0.7)',
                  transform: 'scale(1.1)'
                }
              }}
              onClick={handleDelete}
            >
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Box>
        
        <CardContent sx={{ 
          pt: 4, 
          px: 4, 
          pb: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          position: 'relative',
          '&::before': theme.palette.mode === 'dark' ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '10%',
            width: '80%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
          } : {}
        }}>
          <Typography 
            variant="h5" 
            component="h2" 
            align="center"
            sx={{ 
              fontWeight: 700,
              mb: 1.5,
              letterSpacing: '0.5px',
              backgroundImage: theme.palette.mode === 'dark' ? 
                'linear-gradient(90deg, #fff, #f0f0f0)' : 
                'linear-gradient(90deg, #333, #111)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {book.title}
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            align="center"
            sx={{ 
              mb: 2.5,
              fontStyle: 'italic',
              color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              fontWeight: 500
            }}
          >
            By {book.author}
          </Typography>
          
          <Chip 
            label={`${book.quantity} available`} 
            color={book.quantity > 0 ? "primary" : "error"}
            size="small"
            sx={{ 
              mb: 3, 
              px: 1,
              height: 28,
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          
          {book.description && (
            <>
              <Divider sx={{ 
                width: '100%', 
                mb: 2.5, 
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                height: '2px',
                borderRadius: '1px'
              }} />
              <Box sx={{ width: '100%', mb: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1,
                    maxHeight: expanded ? 'none' : '4.5em',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: expanded ? 'unset' : 3,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.6,
                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)',
                    letterSpacing: '0.2px',
                    fontWeight: 400
                  }}
                >
                  {book.description}
                </Typography>
                
                {book.description.length > 120 && (
                  <Button 
                    size="small" 
                    onClick={toggleExpanded}
                    sx={{ 
                      p: 0,
                      textTransform: 'none',
                      color: theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      letterSpacing: '0.3px',
                      '&:hover': {
                        background: 'transparent',
                        opacity: 0.8
                      }
                    }}
                    endIcon={expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                  >
                    {expanded ? 'Read less' : 'Read more'}
                  </Button>
                )}
              </Box>
            </>
          )}
        </CardContent>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <CardActions sx={{ p: 4, pt: 0 }}>
          {user?.role === 'student' && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => setDialogOpen(true)}
              disabled={loading || book.quantity < 1}
              sx={{ 
                borderRadius: '8px',
                py: 1.2,
                fontWeight: 600,
                letterSpacing: '0.5px',
                boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(90deg, #1976d2, #2196f3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.6)',
                  transform: 'translateY(-2px)'
                },
                '&:active': {
                  transform: 'translateY(1px)'
                }
              }}
            >
              Request Book
            </Button>
          )}
          
          {user?.role === 'admin' && (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={handleDelete}
              disabled={loading}
              sx={{ 
                borderRadius: '8px',
                py: 1.2,
                fontWeight: 600,
                letterSpacing: '0.5px',
                borderWidth: '2px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderWidth: '2px',
                  background: 'rgba(211, 47, 47, 0.04)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Delete Book
            </Button>
          )}
        </CardActions>
      </Card>

      {/* Request Book Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 24px 38px rgba(0,0,0,0.2), 0 9px 46px rgba(0,0,0,0.12)',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600,
          pt: 3
        }}>
          Request Book
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            Are you sure you want to request <span style={{ fontWeight: 'bold' }}>{book.title}</span> by {book.author}?
          </DialogContentText>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, opacity: 0.8 }}>
            Once approved by the librarian, you'll be notified and can collect the book.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            sx={{ 
              fontWeight: 500,
              textTransform: 'none',
              px: 2
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRequestBook} 
            variant="contained" 
            disabled={loading}
            sx={{ 
              fontWeight: 600,
              textTransform: 'none',
              px: 2,
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #1976d2, #2196f3)',
              boxShadow: '0 4px 10px rgba(25, 118, 210, 0.35)'
            }}
          >
            Confirm Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionProps={{ 
          appear: true,
          direction: 'up',
          style: {
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }
        }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            fontWeight: 500
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookItem; 