import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import authService from '../services/authService';

const BorrowedBooksPage = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = authService.getCurrentUser();
  const hasFetched = React.useRef(false);

  useEffect(() => {
    // Access the user ID using the correct full claim type URI key
    const userId = currentUser?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    // Only attempt to fetch if currentUser and userId are available and we haven't fetched yet
    if (currentUser && userId && !hasFetched.current) {
      fetchBorrowedBooks(userId);
      hasFetched.current = true; // Mark as fetched
    } else if (!currentUser) {
      setError('User not logged in.');
      setLoading(false);
      hasFetched.current = false; // Reset if user logs out
    } else if (!userId) {
        setError('User ID not available. Please log in again.');
        setLoading(false);
        hasFetched.current = false; // Reset if user ID is missing
    }
  }, [currentUser]); // Depend on currentUser to refetch if user state changes

  const fetchBorrowedBooks = (userId) => {
    setLoading(true);
    setError(null); // Clear previous errors on new fetch attempt
    // TODO: Implement backend endpoint to get loans for a specific user
    axios.get(`http://localhost:5022/api/BookLoan/user/${userId}`)
      .then(response => {
        setBorrowedBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching borrowed books:', error);
        if (error.response && error.response.status === 404) {
          setBorrowedBooks([]); // Set to empty array if 404 (no books found)
          setError(null); // Clear any previous error
        } else {
          setError('Failed to load borrowed books.');
        }
        setLoading(false);
      });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        My Borrowed Books
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      ) : (borrowedBooks && borrowedBooks.length > 0 ? (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
             Currently Borrowed
          </Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.light' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Book Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Loan Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fine Amount</TableCell>
                  {/* Add more relevant columns for user view if needed */}
                </TableRow>
              </TableHead>
              <TableBody>
                {borrowedBooks.map(loan => (
                  <TableRow key={loan.bookLoanId}>
                    <TableCell>{loan.bookTitle}</TableCell>
                    <TableCell>{new Date(loan.loanDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(loan.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{loan.status}</TableCell>
                     <TableCell>{loan.fineAmount !== null ? `$${loan.fineAmount.toFixed(2)}` : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
       ) : (<Box sx={{ mt: 4, textAlign: 'center' }}><Typography variant="h6">No borrowed books found.</Typography></Box>))
      }
    </Container>
  );
};

export default BorrowedBooksPage; 