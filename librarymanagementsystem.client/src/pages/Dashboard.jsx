import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Container,
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
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalLoans: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [openAddBookDialog, setOpenAddBookDialog] = useState(false);
  const [newBookData, setNewBookData] = useState({
    isbn: '',
    title: '',
    author: '',
    publicationYear: '',
    publisher: '',
    totalCopies: '',
    description: '',
    coverImageURL: '',
    location: '',
    categoryId: '',
    status: 0
  });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, type: null });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, booksRes, loansRes, contactRes] = await Promise.all([
        axios.get('http://localhost:5022/api/Account/users'),
        axios.get('http://localhost:5022/api/Book'),
        axios.get('http://localhost:5022/api/BookLoan'),
        axios.get('http://localhost:5022/api/Contact')
      ]);

      const activeLoans = loansRes.data.filter(loan => loan.status === 'Borrowed');

      setUsers(usersRes.data);
      setBooks(booksRes.data);
      setContactSubmissions(contactRes.data);
      setStats({
        totalUsers: usersRes.data.length,
        totalBooks: booksRes.data.length,
        totalLoans: activeLoans.length
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleAddBookClick = () => {
    setOpenAddBookDialog(true);
  };

  const handleCloseAddBookDialog = () => {
    setOpenAddBookDialog(false);
    setNewBookData({
      isbn: '',
      title: '',
      author: '',
      publicationYear: '',
      publisher: '',
      totalCopies: '',
      description: '',
      coverImageURL: '',
      location: '',
      categoryId: '',
      status: 0
    });
  };

  const handleNewBookInputChange = (event) => {
    const { name, value } = event.target;
    setNewBookData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSaveNewBook = () => {
    axios.post('http://localhost:5022/api/Book', newBookData)
      .then(response => {
        console.log('Book added successfully:', response.data);
        handleCloseAddBookDialog();
        fetchDashboardData();
      })
      .catch(error => {
        console.error('Error adding book:', error);
      });
  };

  const handleDeleteClick = (id, type) => {
    setDeleteConfirm({ open: true, id, type });
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirm({ open: false, id: null, type: null });
  };

  const handleConfirmDelete = () => {
    const { id, type } = deleteConfirm;
    const endpoint = type === 'user' 
      ? `http://localhost:5022/api/Account/users/${id}`
      : type === 'book' ? `http://localhost:5022/api/Book/${id}`
      : `http://localhost:5022/api/Contact/${id}`;

    axios.delete(endpoint)
      .then(() => {
        console.log(`${type} ${id} deleted successfully`);
        handleCloseDeleteConfirm();
        fetchDashboardData();
      })
      .catch(error => {
        console.error(`Error deleting ${type} ${id}:`, error);
        handleCloseDeleteConfirm();
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5">{stats.totalUsers}</Typography>
            <Typography color="text.secondary">Total Users</Typography>
          </Paper>
          </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5">{stats.totalBooks}</Typography>
            <Typography color="text.secondary">Total Books</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <LocalLibraryIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5">{stats.totalLoans}</Typography>
            <Typography color="text.secondary">Active Loans</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>Quick Actions</Typography>
      <Button
        variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddBookClick}
          sx={{ mr: 2 }}
        >
          Add New Book
        </Button>
      </Box>

      {/* Recent Users */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>Recent Users</Typography>
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(0, 5).map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete User">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(user.id, 'user')}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Recent Books */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>Recent Books</Typography>
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.slice(0, 5).map(book => (
                <TableRow key={book.bookId}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete Book">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(book.bookId, 'book')}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Contact Submissions */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>Contact Submissions</Typography>
        {contactSubmissions.length > 0 ? (
          <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.light' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Submission Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contactSubmissions.map(submission => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{submission.subject}</TableCell>
                    <TableCell>{submission.message}</TableCell>
                    <TableCell>{new Date(submission.submissionDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Tooltip title="Delete Submission">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(submission.id, 'submission')}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No contact submissions found.</Typography>
        )}
      </Box>

      {/* Add Book Dialog */}
      <Dialog open={openAddBookDialog} onClose={handleCloseAddBookDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add New Book</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="isbn"
            label="ISBN"
            type="text"
            fullWidth
            variant="outlined"
            value={newBookData.isbn}
            onChange={handleNewBookInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newBookData.title}
            onChange={handleNewBookInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="author"
            label="Author"
            type="text"
            fullWidth
            variant="outlined"
            value={newBookData.author}
            onChange={handleNewBookInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="publicationYear"
            label="Publication Year"
            type="number"
            fullWidth
            variant="outlined"
            value={newBookData.publicationYear}
            onChange={handleNewBookInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="publisher"
            label="Publisher"
            type="text"
            fullWidth
            variant="outlined"
            value={newBookData.publisher}
            onChange={handleNewBookInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="totalCopies"
            label="Total Copies"
            type="number"
            fullWidth
            variant="outlined"
            value={newBookData.totalCopies}
            onChange={handleNewBookInputChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddBookDialog}>Cancel</Button>
          <Button onClick={handleSaveNewBook} variant="contained">Save Book</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={handleCloseDeleteConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to delete this {deleteConfirm.type === 'user' ? 'user' : deleteConfirm.type === 'book' ? 'book' : 'submission'}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
      </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 