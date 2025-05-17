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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const fetchUsers = () => {
    setLoadingUsers(true);
    axios.get('http://localhost:5022/api/Account/users')
      .then(response => {
        setUsers(response.data);
        setLoadingUsers(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setErrorUsers('Failed to load users.');
        setLoadingUsers(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirm({ open: false, id: null });
  };

  const handleConfirmDelete = () => {
    axios.delete(`http://localhost:5022/api/Account/users/${deleteConfirm.id}`)
      .then(() => {
        console.log(`User ${deleteConfirm.id} deleted successfully`);
        handleCloseDeleteConfirm();
        fetchUsers(); // Refresh users list after deleting
      })
      .catch(error => {
        console.error(`Error deleting user ${deleteConfirm.id}:`, error);
        // Handle error (e.g., show an alert)
        handleCloseDeleteConfirm();
      });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Manage Users
      </Typography>

      {loadingUsers ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : errorUsers ? (
        <Alert severity="error">{errorUsers}</Alert>
      ) : (users && users.length > 0 ? (
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Active</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                     <Tooltip title="Delete User">
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(user.id)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                     </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
       ) : (<Typography>No users found.</Typography>))
      }

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
            Are you sure you want to delete this user?
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

export default ManageUsersPage; 