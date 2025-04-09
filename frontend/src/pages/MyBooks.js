import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import IssuedBookItem from '../components/IssuedBookItem';
import { getUserIssues } from '../utils/api';

const MyBooks = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const data = await getUserIssues();
        setIssues(data);
      } catch (err) {
        setError('Failed to load your books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBookReturn = (returnedIssueId) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue._id === returnedIssueId 
          ? { ...issue, isReturned: true } 
          : issue
      )
    );
  };

  const currentIssues = issues.filter(issue => !issue.isReturned);
  const historyIssues = issues.filter(issue => issue.isReturned);

  const renderIssuesList = (issuesList) => {
    if (issuesList.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
          {tabValue === 0 ? 'You have no current books issued.' : 'You have no book issue history.'}
        </Alert>
      );
    }

    return (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {issuesList.map((issue) => (
          <IssuedBookItem 
            key={issue._id} 
            issue={issue} 
            onReturn={handleBookReturn}
          />
        ))}
      </Grid>
    );
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

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ textAlign: 'center', mb: 3 }}
        >
          My Books
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
          >
            <Tab label={`Current Issues (${currentIssues.length})`} />
            <Tab label={`History (${historyIssues.length})`} />
          </Tabs>
        </Box>

        <Box sx={{ py: 2 }}>
          {tabValue === 0 && renderIssuesList(currentIssues)}
          {tabValue === 1 && renderIssuesList(historyIssues)}
        </Box>
      </Box>
    </Container>
  );
};

export default MyBooks; 