import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import { getAllIssues } from '../utils/api';

const AllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const data = await getAllIssues();
        setIssues(data);
        setFilteredIssues(data);
      } catch (err) {
        setError('Failed to load issues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = issues.filter(
        issue => 
          issue.book?.title?.toLowerCase().includes(lowercasedSearch) ||
          issue.book?.author?.toLowerCase().includes(lowercasedSearch) ||
          issue.user?.name?.toLowerCase().includes(lowercasedSearch) ||
          issue.user?.email?.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredIssues(filtered);
      setPage(0); // Reset to first page when searching
    } else {
      setFilteredIssues(issues);
    }
  }, [searchTerm, issues]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
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
          All Book Issues
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by book title, author, user name, or email..."
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

        {filteredIssues.length === 0 && !loading && !error && (
          <Alert severity="info">
            {searchTerm ? 'No issues found matching your search.' : 'No book issues available.'}
          </Alert>
        )}

        {filteredIssues.length > 0 && (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Book Title</strong></TableCell>
                    <TableCell><strong>Author</strong></TableCell>
                    <TableCell><strong>User</strong></TableCell>
                    <TableCell><strong>Issue Date</strong></TableCell>
                    <TableCell><strong>Return Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredIssues
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((issue) => (
                      <TableRow hover key={issue._id}>
                        <TableCell>{issue.book?.title || 'N/A'}</TableCell>
                        <TableCell>{issue.book?.author || 'N/A'}</TableCell>
                        <TableCell>
                          <div>{issue.user?.name || 'N/A'}</div>
                          <div style={{ color: 'gray', fontSize: '0.8rem' }}>
                            {issue.user?.email || ''}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(issue.issueDate)}</TableCell>
                        <TableCell>{formatDate(issue.returnDate)}</TableCell>
                        <TableCell>
                          {issue.isReturned ? (
                            <Chip 
                              label="Returned" 
                              color="success" 
                              size="small" 
                            />
                          ) : (
                            <Chip 
                              label="Not Returned" 
                              color="warning" 
                              size="small" 
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredIssues.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default AllIssues; 