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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button
} from '@mui/material';
import axios from 'axios';

const ManageBookLoansPage = () => {
  const [bookLoans, setBookLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [fineAmount, setFineAmount] = useState('');
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    fetchBookLoans();
  }, []);

  const fetchBookLoans = () => {
    setLoading(true);
    axios.get('http://localhost:5022/api/BookLoan')
      .then(response => {
        setBookLoans(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching book loans:', error);
        setError('Failed to load book loans.');
        setLoading(false);
      });
  };

  const handleEditClick = (loan) => {
    setEditingLoan(loan);
    setFineAmount(loan.fineAmount !== null ? loan.fineAmount.toFixed(2) : '');
    setReturnDate(loan.returnDate ? loan.returnDate.split('T')[0] : '');
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingLoan(null);
    setFineAmount('');
    setReturnDate('');
  };

  const handleFineAmountChange = (event) => {
    setFineAmount(event.target.value);
  };

  const handleReturnDateChange = (event) => {
    setReturnDate(event.target.value);
  };

  const handleSaveLoan = async () => {
    if (!editingLoan) return;

    try {
      const updatedLoanData = {
        ...editingLoan,
        fineAmount: parseFloat(fineAmount) || 0,
        returnDate: returnDate || null,
      };

      delete updatedLoanData.bookTitle;
      delete updatedLoanData.userName;

      await axios.put(`http://localhost:5022/api/BookLoan/${editingLoan.bookLoanId}`, updatedLoanData);
      console.log('Book loan updated successfully');
      handleCloseEditDialog();
      fetchBookLoans();
    } catch (error) {
      console.error('Error saving book loan:', error);
      handleCloseEditDialog();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Manage Book Loans
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (bookLoans && bookLoans.length > 0 ? (
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Loan ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Book Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>User Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Loan Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Return Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fine Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookLoans.map(loan => (
                <TableRow key={loan.bookLoanId}>
                  <TableCell>{loan.bookLoanId}</TableCell>
                  <TableCell>{loan.bookTitle}</TableCell>
                  <TableCell>{loan.userName}</TableCell>
                  <TableCell>{new Date(loan.loanDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(loan.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>{loan.status}</TableCell>
                  <TableCell>{loan.fineAmount !== null ? `$${loan.fineAmount.toFixed(2)}` : '-'}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleEditClick(loan)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
       ) : (<Typography>No book loans found.</Typography>))
      }

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Book Loan</DialogTitle>
        <DialogContent>
          {editingLoan && (
            <Box component="form" noValidate autoComplete="off">
              <Typography variant="subtitle1" gutterBottom>
                Book: {editingLoan.bookTitle}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                User: {editingLoan.userName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Loan Date: {new Date(editingLoan.loanDate).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Due Date: {new Date(editingLoan.dueDate).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Status: {editingLoan.status}
              </Typography>
              <TextField
                margin="dense"
                name="returnDate"
                label="Return Date"
                type="date"
                fullWidth
                variant="outlined"
                value={returnDate}
                onChange={handleReturnDateChange}
                InputLabelProps={{
                    shrink: true,
                }}
                sx={{ mt: 2 }}
              />
              <TextField
                margin="dense"
                name="fineAmount"
                label="Fine Amount"
                type="number"
                fullWidth
                variant="outlined"
                value={fineAmount}
                onChange={handleFineAmountChange}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveLoan} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageBookLoansPage; 