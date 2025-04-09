import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Grid, 
  Chip,
  Avatar,
  Box,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@mui/material';
import { Check, Close, Person, Book } from '@mui/icons-material';
import { format } from 'date-fns';
import { approveRequest, rejectRequest } from '../utils/api';

const BookRequestItem = ({ request, onApprove, onReject }) => {
  const [loading, setLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleApprove = async () => {
    try {
      setLoading(true);
      await approveRequest(request._id);
      setSnackbar({
        open: true,
        message: 'Request approved successfully!',
        severity: 'success'
      });
      onApprove && onApprove(request._id);
    } catch (error) {
      console.error('Error approving request:', error);
      setSnackbar({
        open: true,
        message: 'Failed to approve request',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const openRejectDialog = () => {
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    try {
      setLoading(true);
      await rejectRequest(request._id, rejectReason);
      setSnackbar({
        open: true,
        message: 'Request rejected successfully',
        severity: 'info'
      });
      onReject && onReject(request._id);
      setRejectDialogOpen(false);
    } catch (error) {
      console.error('Error rejecting request:', error);
      setSnackbar({
        open: true,
        message: 'Failed to reject request',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
  };

  return (
    <>
      <Grid item xs={12}>
        <Card 
          elevation={3} 
          sx={{ 
            mb: 2,
            borderRadius: '12px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Book />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {request.book?.title || 'Unknown Book'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {request.book?.author || 'Unknown Author'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider orientation="vertical" flexItem sx={{ mx: 3, display: { xs: 'none', sm: 'block' } }} />
              <Divider sx={{ my: 2, display: { xs: 'block', sm: 'none' } }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    {request.user?.name || 'Unknown User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {request.user?.email || ''}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ ml: 'auto', mt: { xs: 2, sm: 0 }, alignSelf: { xs: 'flex-start', sm: 'center' } }}>
                <Chip 
                  label={request.status.charAt(0).toUpperCase() + request.status.slice(1)} 
                  color={request.status === 'pending' ? "warning" : request.status === 'approved' ? "success" : "error"} 
                  size="small" 
                  sx={{ fontWeight: 'bold' }} 
                />
                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                  Requested: {formatDate(request.requestDate || request.createdAt)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
          
          <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
            {request.status === 'pending' && (
              <>
                <Button 
                  startIcon={<Close />} 
                  color="error" 
                  onClick={openRejectDialog}
                  disabled={loading}
                  sx={{ borderRadius: '20px' }}
                >
                  Reject
                </Button>
                <Button 
                  startIcon={<Check />} 
                  variant="contained" 
                  color="success" 
                  onClick={handleApprove}
                  disabled={loading}
                  sx={{ 
                    ml: 1, 
                    borderRadius: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                    }
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </CardActions>
        </Card>
      </Grid>

      {/* Rejection Dialog */}
      <Dialog 
        open={rejectDialogOpen} 
        onClose={() => setRejectDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Reject Book Request
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to reject the request for "{request.book?.title}" by {request.user?.name}?
          </DialogContentText>
          <TextField
            autoFocus
            label="Reason for rejection (optional)"
            fullWidth
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            multiline
            rows={3}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setRejectDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleRejectConfirm}
            disabled={loading}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookRequestItem; 