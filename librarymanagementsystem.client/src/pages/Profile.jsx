import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Avatar, CircularProgress, Alert } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not logged in.');
      setLoading(false);
      return;
    }
    fetch('http://localhost:5022/api/Account/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user info');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile.');
        setLoading(false);
      });
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 8 }}>{error}</Alert>;

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
          <PersonIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          {user.email}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <b>Roles:</b> {user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'User'}
        </Typography>
      </Paper>
    </Container>
  );
};

export default Profile; 