import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: ''
  });

  const fetchCategories = () => {
    setLoading(true);
    axios.get('http://localhost:5022/api/Category')
      .then(response => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewCategoryData({ name: '', description: '' });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCategoryData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddCategory = () => {
    axios.post('http://localhost:5022/api/Category', newCategoryData)
      .then(response => {
        console.log('Category added successfully:', response.data);
        handleCloseAddDialog();
        fetchCategories(); // Refresh list
      })
      .catch(error => {
        console.error('Error adding category:', error);
        // Handle error
      });
  };

  const handleDeleteCategory = (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    axios.delete(`http://localhost:5022/api/Category/${categoryId}`)
      .then(response => {
        // Optionally show a success message
        fetchCategories(); // Refresh the list
      })
      .catch(error => {
        console.error('Error deleting category:', error);
        // Optionally show an error message
      });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Manage Categories
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Button variant="contained" onClick={handleOpenAddDialog}>Add New Category</Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (categories && categories.length > 0 ? (
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map(category => (
                <TableRow key={category.categoryId}>
                  <TableCell>{category.categoryId}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteCategory(category.categoryId)}
                      aria-label="delete"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
       ) : (<Typography>No categories found.</Typography>))
      }

      {/* Add Category Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newCategoryData.name}
            onChange={handleInputChange}
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
            value={newCategoryData.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddCategory} variant="contained">Add Category</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default ManageCategoriesPage; 