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

  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted

    const initializeFetch = async () => {
      setLoading(true);
      setError(null);

      const currentUser = authService.getCurrentUser();
      const isAuthenticated = authService.isAuthenticated();

      if (isAuthenticated && currentUser) {
        // Access the user ID using the correct full claim type URI key or the Id property
        const userId = currentUser.id || currentUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

        if (userId) {
          try {
            const response = await axios.get(`http://localhost:5022/api/BookLoan/user/${userId}`);
            if (isMounted) {
              setBorrowedBooks(response.data);
              setLoading(false);
            }
          } catch (error) {
            console.error('Error fetching borrowed books:', error);
            if (isMounted) {
              if (error.response && error.response.status === 404) {
                setBorrowedBooks([]);
                setError(null);
              } else if (error.response && error.response.status === 401) {
                 setError('Unauthorized: Please log in again.');
                 authService.logout(); // Log out user on 401
              } else if (error.response && error.response.status === 403) {
                 setError('Forbidden: You do not have access to this resource.');
              }
               else {
                setError('Failed to load borrowed books.');
              }
              setLoading(false);
            }
          }
        } else {
          if (isMounted) {
            setError('User ID not available. Please log in again.');
            setLoading(false);
          }
        }
      } else {
        if (isMounted) {
          setError('User not logged in.');
          setLoading(false);
        }
      }
    };

    initializeFetch();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array means this effect runs once on mount

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