import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import { Book, Pending, CheckCircle, Cancel } from '@mui/icons-material';
import { format } from 'date-fns';
import { getUserRequests } from '../utils/api';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`requests-tabpanel-${index}`}
      aria-labelledby={`requests-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getUserRequests();
        setRequests(data);
      } catch (err) {
        setError('Failed to load your book requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip icon={<Pending />} label="Pending" color="warning" />;
      case 'approved':
        return <Chip icon={<CheckCircle />} label="Approved" color="success" />;
      case 'rejected':
        return <Chip icon={<Cancel />} label="Rejected" color="error" />;
      default:
        return <Chip label={status} />;
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const approvedRequests = requests.filter(req => req.status === 'approved');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');

  return (
    <Container>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          mt: 3, 
          borderRadius: '12px', 
          background: 'linear-gradient(145deg, #5c6bc0 0%, #3f51b5 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          My Book Requests
        </Typography>
        <Typography variant="subtitle1">
          Track the status of your book borrowing requests
        </Typography>
      </Paper>

      <Paper sx={{ borderRadius: '12px', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={`Pending (${pendingRequests.length})`} 
            sx={{ py: 2 }}
          />
          <Tab 
            label={`Approved (${approvedRequests.length})`} 
            sx={{ py: 2 }}
          />
          <Tab 
            label={`Rejected (${rejectedRequests.length})`} 
            sx={{ py: 2 }}
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TabPanel value={tabValue} index={0}>
            {pendingRequests.length === 0 ? (
              <Alert severity="info">You have no pending book requests.</Alert>
            ) : (
              <Grid container spacing={3}>
                {pendingRequests.map((request) => (
                  <RequestCard 
                    key={request._id}
                    request={request}
                    formatDate={formatDate}
                    getStatusChip={getStatusChip}
                  />
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {approvedRequests.length === 0 ? (
              <Alert severity="info">You have no approved book requests.</Alert>
            ) : (
              <Grid container spacing={3}>
                {approvedRequests.map((request) => (
                  <RequestCard 
                    key={request._id}
                    request={request}
                    formatDate={formatDate}
                    getStatusChip={getStatusChip}
                  />
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {rejectedRequests.length === 0 ? (
              <Alert severity="info">You have no rejected book requests.</Alert>
            ) : (
              <Grid container spacing={3}>
                {rejectedRequests.map((request) => (
                  <RequestCard 
                    key={request._id}
                    request={request}
                    formatDate={formatDate}
                    getStatusChip={getStatusChip}
                  />
                ))}
              </Grid>
            )}
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

// Separate component for each request card
const RequestCard = ({ request, formatDate, getStatusChip }) => {
  return (
    <Grid item xs={12} md={6}>
      <Card 
        elevation={2} 
        sx={{ 
          height: '100%',
          borderRadius: '12px',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <Book />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                {request.book?.title || 'Unknown Book'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                by {request.book?.author || 'Unknown Author'}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Request Date:
            </Typography>
            <Typography variant="body2">
              {formatDate(request.requestDate || request.createdAt)}
            </Typography>
          </Box>
          
          {request.responseDate && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Response Date:
              </Typography>
              <Typography variant="body2">
                {formatDate(request.responseDate)}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Status:
            </Typography>
            {getStatusChip(request.status)}
          </Box>
          
          {request.responseMessage && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Librarian Note:
              </Typography>
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px' }}>
                <Typography variant="body2">
                  {request.responseMessage}
                </Typography>
              </Paper>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default MyRequests; 