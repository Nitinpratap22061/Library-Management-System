import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Grid, 
  Chip, 
  Box, 
  Avatar, 
  Divider,
  Tooltip,
  LinearProgress,
  IconButton
} from '@mui/material';
import { 
  AssignmentReturn, 
  CalendarToday, 
  ImportContacts, 
  CheckCircle, 
  Warning, 
  AccessTime,
  EventAvailable
} from '@mui/icons-material';
import { format, differenceInDays, addDays, isBefore } from 'date-fns';
import { returnBook } from '../utils/api';

const IssuedBookItem = ({ issue, onReturn }) => {
  const [loading, setLoading] = useState(false);

  // Get due date (10 days from issue date)
  const dueDate = issue.dueDate || addDays(new Date(issue.issueDate), 10);
  const today = new Date();
  
  // Calculate days left
  const daysLeft = differenceInDays(dueDate, today);
  
  // Status calculations 
  const isOverdue = isBefore(dueDate, today) && !issue.isReturned;
  const isDueSoon = daysLeft <= 2 && daysLeft >= 0 && !issue.isReturned;
  
  // Progress calculation (for progress bar)
  const totalDays = 10;
  const daysUsed = totalDays - daysLeft;
  const progress = Math.min(Math.max((daysUsed / totalDays) * 100, 0), 100);

  // Get first letter of book title for avatar
  const bookInitial = issue.book.title.charAt(0).toUpperCase();

  // Generate gradient background colors based on book title
  const generateGradient = (title) => {
    const hash = title.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const hue1 = hash % 360;
    const hue2 = (hash * 1.5) % 360;
    return `linear-gradient(135deg, hsla(${hue1}, 80%, 70%, 0.8), hsla(${hue2}, 80%, 60%, 0.9))`;
  };

  const avatarBg = generateGradient(issue.book.title);

  const handleReturn = async () => {
    try {
      setLoading(true);
      await returnBook(issue.book._id);
      onReturn && onReturn(issue._id);
    } catch (error) {
      console.error('Error returning book:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const statusColor = issue.isReturned 
    ? '#4caf50' 
    : isOverdue 
      ? '#f44336' 
      : isDueSoon 
        ? '#ff9800' 
        : '#1976d2';

  const statusText = issue.isReturned 
    ? 'Returned' 
    : isOverdue 
      ? 'Overdue' 
      : isDueSoon 
        ? 'Due Soon' 
        : 'Borrowed';

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card 
        elevation={0} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 22px 45px 0 rgba(0, 0, 0, 0.14)'
          },
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
        }}
      >
        <Box 
          sx={{ 
            position: 'relative',
            height: '140px',
            background: avatarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} 
        >
          <Avatar 
            sx={{ 
              width: 70,
              height: 70,
              fontSize: '2rem',
              fontWeight: 'bold',
              bgcolor: 'rgba(255, 255, 255, 0.85)', 
              color: 'rgba(0, 0, 0, 0.75)', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '4px solid rgba(255, 255, 255, 0.8)',
            }}
          >
            {bookInitial}
          </Avatar>
          <Chip 
            label={statusText}
            size="small"
            icon={
              issue.isReturned ? <CheckCircle fontSize="small" /> :
              isOverdue ? <Warning fontSize="small" /> :
              <AccessTime fontSize="small" />
            }
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontWeight: 600,
              bgcolor: issue.isReturned ? 'rgba(76, 175, 80, 0.9)' : 
                     isOverdue ? 'rgba(244, 67, 54, 0.9)' :
                     isDueSoon ? 'rgba(255, 152, 0, 0.9)' : 'rgba(25, 118, 210, 0.9)',
              color: 'white',
              boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.2)',
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              color: '#1a1a2e',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
              fontSize: '1.4rem',
              mb: 0.5
            }}
          >
            {issue.book.title}
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ 
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.95rem'
            }}
          >
            <ImportContacts sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
            By {issue.book.author}
          </Typography>
          
          <Divider sx={{ my: 1.5 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday sx={{ fontSize: 18, color: 'primary.main', opacity: 0.8 }} />
            <Typography variant="body2" sx={{ fontSize: '0.95rem', fontWeight: 500 }}>
              Issued: {formatDate(issue.issueDate)}
            </Typography>
          </Box>
          
          {issue.isReturned ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventAvailable sx={{ fontSize: 18, color: '#4caf50', opacity: 0.9 }} />
              <Typography variant="body2" sx={{ fontSize: '0.95rem', fontWeight: 500, color: '#1e8e3e' }}>
                Returned: {formatDate(issue.returnDate)}
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime sx={{ 
                  fontSize: 18, 
                  color: statusColor,
                  opacity: 0.9
                }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: statusColor,
                  }}
                >
                  Due: {formatDate(dueDate)}
                  {isOverdue && ' (Overdue)'}
                  {isDueSoon && !isOverdue && ` (${daysLeft} days left)`}
                </Typography>
              </Box>
              
              <Tooltip 
                title={`${isOverdue ? 'Overdue' : daysLeft} ${isOverdue ? 'days' : 'days left'}`} 
                arrow
                placement="top"
              >
                <Box sx={{ width: '100%', mt: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: statusColor,
                        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                      }
                    }} 
                  />
                </Box>
              </Tooltip>
            </>
          )}
        </CardContent>
        
        <CardActions sx={{ p: 3, pt: 0 }}>
          {!issue.isReturned && (
            <Button 
              fullWidth
              variant="contained" 
              color={isOverdue ? "error" : "primary"} 
              startIcon={<AssignmentReturn />}
              onClick={handleReturn}
              disabled={loading}
              sx={{ 
                borderRadius: '30px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                py: 1.2,
                fontWeight: 600,
                letterSpacing: '0.02em',
                textTransform: 'none',
                fontSize: '0.95rem',
                background: isOverdue 
                  ? 'linear-gradient(90deg, #d32f2f, #f44336)'
                  : 'linear-gradient(90deg, #1976d2, #2196f3)',
                '&:hover': {
                  boxShadow: '0 6px 14px rgba(0, 0, 0, 0.2)',
                  background: isOverdue 
                    ? 'linear-gradient(90deg, #c62828, #d32f2f)'
                    : 'linear-gradient(90deg, #1565c0, #1976d2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Return Book
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};

export default IssuedBookItem; 