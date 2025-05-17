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
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const ManageBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [errorBooks, setErrorBooks] = useState(null);
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
    status: 0 // Default status, adjust if needed
  });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  const fetchBooks = () => {
    setLoadingBooks(true);
    axios.get('http://localhost:5022/api/Book')
      .then(response => {
        setBooks(response.data);
        setLoadingBooks(false);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setErrorBooks('Failed to load books.');
        setLoadingBooks(false);
      });
  };

  const fetchCategories = () => {
    setLoadingCategories(true);
    axios.get('http://localhost:5022/api/Book/categories')
      .then(response => {
        setCategories(response.data);
        setLoadingCategories(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setErrorCategories('Failed to load categories.');
        setLoadingCategories(false);
      });
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const handleAddBookClick = () => {
    setOpenAddBookDialog(true);
  };

  const handleCloseAddBookDialog = () => {
    setOpenAddBookDialog(false);
    // Reset form data
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
        fetchBooks(); // Refresh books list after adding
      })
      .catch(error => {
        console.error('Error adding book:', error);
        // Handle error (e.g., show an alert)
      });
  };

  // Delete Handlers
  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirm({ open: false, id: null });
  };

  const handleConfirmDelete = () => {
    axios.delete(`http://localhost:5022/api/Book/${deleteConfirm.id}`)
      .then(() => {
        console.log(`Book ${deleteConfirm.id} deleted successfully`);
        handleCloseDeleteConfirm();
        fetchBooks(); // Refresh books list after deleting
      })
      .catch(error => {
        console.error(`Error deleting book ${deleteConfirm.id}:`, error);
        // Handle error
        handleCloseDeleteConfirm();
      });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Manage Books
      </Typography>

       {/* Quick Actions */}
      <Box sx={{ mb: 6 }}>
         <Typography variant="h5" gutterBottom>Quick Actions</Typography>
         <Button variant="contained" onClick={handleAddBookClick}>Add New Book</Button>
      </Box>

      {loadingBooks ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : errorBooks ? (
        <Alert severity="error">{errorBooks}</Alert>
      ) : (books && books.length > 0 ? (
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
                 <TableCell sx={{ fontWeight: 'bold' }}>Publisher</TableCell>
                 <TableCell sx={{ fontWeight: 'bold' }}>Year</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Copies</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                {/* Add more book details columns as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map(book => (
                <TableRow key={book.bookId}>
                  <TableCell>{book.bookId}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.publisher}</TableCell>
                   <TableCell>{book.publicationYear}</TableCell>
                  <TableCell>{book.totalCopies}</TableCell>
                  <TableCell>{book.status}</TableCell>
                  <TableCell>
                     <Tooltip title="Delete Book">
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(book.bookId)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                     </Tooltip>
                  </TableCell>
                  {/* Render more book details here */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
       ) : (<Typography>No books found.</Typography>))
      }

      {/* Add New Book Dialog */}
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
           <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newBookData.description}
            onChange={handleNewBookInputChange}
            sx={{ mb: 2 }}
          />
            <TextField
            margin="dense"
            name="coverImageURL"
            label="Cover Image URL"
            type="text"
            fullWidth
            variant="outlined"
            value={newBookData.coverImageURL}
            onChange={handleNewBookInputChange}
            sx={{ mb: 2 }}
          />
           <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            variant="outlined"
            value={newBookData.location}
            onChange={handleNewBookInputChange}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              name="categoryId"
              value={newBookData.categoryId}
              label="Category"
              onChange={handleNewBookInputChange}
              disabled={loadingCategories || errorCategories}
            >
              {loadingCategories && <MenuItem disabled>Loading Categories...</MenuItem>}
              {errorCategories && <MenuItem disabled>Error loading categories</MenuItem>}
              {!loadingCategories && !errorCategories && categories.map(category => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

           {/* Note: Status is set to 0 by default in state, adjust if needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddBookDialog}>Cancel</Button>
          <Button onClick={handleSaveNewBook}>Save Book</Button>
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
            Are you sure you want to delete this book?
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

export default ManageBooksPage; 