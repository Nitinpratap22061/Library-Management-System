import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Grid,
  Divider,
  TextField,
  InputAdornment,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookRequestItem from '../components/BookRequestItem';
import { getAllRequests } from '../utils/api';

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

const BookRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getAllRequests();
        setRequests(data);
        setFilteredRequests(data.filter(req => req.status === 'pending'));
      } catch (err) {
        setError('Failed to load book requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = requests.filter(request => 
        (request.status === (tabValue === 0 ? 'pending' : tabValue === 1 ? 'approved' : 'rejected')) &&
        (
          request.book?.title?.toLowerCase().includes(lowercasedSearch) ||
          request.book?.author?.toLowerCase().includes(lowercasedSearch) ||
          request.user?.name?.toLowerCase().includes(lowercasedSearch) ||
          request.user?.email?.toLowerCase().includes(lowercasedSearch)
        )
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests.filter(request => 
        request.status === (tabValue === 0 ? 'pending' : tabValue === 1 ? 'approved' : 'rejected')
      ));
    }
  }, [searchTerm, requests, tabValue]);

  const handleApprove = (requestId) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req._id === requestId 
          ? { ...req, status: 'approved' } 
          : req
      )
    );
  };

  const handleReject = (requestId) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req._id === requestId 
          ? { ...req, status: 'rejected' } 
          : req
      )
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  const pendingCount = requests.filter(req => req.status === 'pending').length;
  const approvedCount = requests.filter(req => req.status === 'approved').length;
  const rejectedCount = requests.filter(req => req.status === 'rejected').length;

  return (
    <Container>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          mt: 3, 
          borderRadius: '12px', 
          background: 'linear-gradient(145deg, #1976d2 0%, #2196f3 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Book Requests
        </Typography>
        <Typography variant="subtitle1">
          Manage student requests to borrow books from the library
        </Typography>
      </Paper>

      <Paper sx={{ borderRadius: '12px', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={`Pending (${pendingCount})`} 
            sx={{ py: 2 }}
          />
          <Tab 
            label={`Approved (${approvedCount})`} 
            sx={{ py: 2 }}
          />
          <Tab 
            label={`Rejected (${rejectedCount})`} 
            sx={{ py: 2 }}
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by book title, author, student name, or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TabPanel value={tabValue} index={0}>
            {filteredRequests.length === 0 ? (
              <Alert severity="info">No pending book requests found.</Alert>
            ) : (
              <Grid container spacing={2}>
                {filteredRequests.map((request) => (
                  <BookRequestItem
                    key={request._id}
                    request={request}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {filteredRequests.length === 0 ? (
              <Alert severity="info">No approved book requests found.</Alert>
            ) : (
              <Grid container spacing={2}>
                {filteredRequests.map((request) => (
                  <BookRequestItem
                    key={request._id}
                    request={request}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {filteredRequests.length === 0 ? (
              <Alert severity="info">No rejected book requests found.</Alert>
            ) : (
              <Grid container spacing={2}>
                {filteredRequests.map((request) => (
                  <BookRequestItem
                    key={request._id}
                    request={request}
                    onApprove={handleApprove}
                    onReject={handleReject}
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

export default BookRequests; 