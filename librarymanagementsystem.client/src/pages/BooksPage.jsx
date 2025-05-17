import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/authService';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5022/api/Book');
      setBooks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load books. Please try again later.');
      setLoading(false);
    }
  };

  const handleBorrowClick = (book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBook(null);
  };

  const handleConfirmBorrow = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Access the user ID using the correct full claim type URI key
      const userId = currentUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      
      if (!userId) {
          console.error('Current User ID is missing from token.', currentUser);
          setError('User ID not available. Please log in again.');
          handleCloseDialog();
          // Optionally navigate to login
          // navigate('/login');
          return;
      }

      console.log('Current User ID:', userId);

      const loanData = {
        bookId: selectedBook.bookId,
        userId: userId, // Use the correctly accessed userId
        loanDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        status: 'Borrowed',
        fineAmount: 0.00,
        returnDate: null
      };

      await axios.post('http://localhost:5022/api/BookLoan', loanData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      handleCloseDialog();
      navigate('/my-books');
    } catch (err) {
      // Log the full error response for debugging
      console.error('Failed to borrow book error object:', err);

      let userErrorMessage = 'Failed to borrow book. Please try again later.';

      // Check if the response contains validation errors (status 400)
      if (err.response && err.response.status === 400) {
         console.error('400 Bad Request Response Data:', err.response.data);
         
         const backendErrors = err.response.data?.errors;

        if (backendErrors) {
          // Format validation errors into a readable string
          const errorMessages = Object.entries(backendErrors)
            .map(([field, messages]) => {
              // Ensure messages is an array and contains strings
              if (Array.isArray(messages)) {
                return `${field}: ${messages.join(', ')}`;
              } else {
                // Handle cases where message might not be in an array
                return `${field}: ${messages}`;
              }
            })
            .join('\n'); // Join errors for different fields with a newline

          userErrorMessage = `Validation Errors:\n${errorMessages}`;

        } else if (err.response.data && typeof err.response.data === 'string') {
           // If there's a simple string message from the backend
          userErrorMessage = err.response.data;

        } else {
          // Fallback for 400 errors with no clear error structure
           userErrorMessage = 'Bad Request: Invalid data sent.';
        }

      } else if (err.message) {
        // Fallback to the general error message from the error object for non-400 errors
        userErrorMessage = err.message;
      }

      // Set the state with the formatted string message
      setError(userErrorMessage);
      handleCloseDialog();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Available Books
      </Typography>
      <Grid container spacing={4}>
        {books.map((book) => (
          <Grid item key={book.bookId} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={book.coverImageURL || 'https://via.placeholder.com/200x300?text=No+Cover'}
                alt={book.title}
                sx={{ objectFit: 'contain' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Author: {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  ISBN: {book.isbn}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Available Copies: {book.totalCopies}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleBorrowClick(book)}
                  disabled={book.totalCopies <= 0}
                >
                  {book.totalCopies > 0 ? 'Borrow Book' : 'Not Available'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Book Borrowing</DialogTitle>
        <DialogContent>
          {selectedBook && (
            <>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to borrow "{selectedBook.title}"?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You will have 14 days to return the book. Late returns may incur fines.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmBorrow} variant="contained" color="primary">
            Confirm Borrow
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BooksPage; 