import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';

const Home = () => (
    <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ bgcolor: '#1976d2', color: '#fff', height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Address</Typography>
                        <Typography>
                            Chirrakkal Palace,<br />
                            Bengalure, Karnataka,<br />
                            Pin: 676533
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={8}>
                <Card sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <img
                        src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
                        alt="Library"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            flexDirection: 'column',
                            textAlign: 'center',
                            px: 2,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Nothing is more important than an unread library.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mt: 1 }}>
                            — John Waters
                        </Typography>
                    </Box>
                </Card>
            </Grid>
        </Grid>
        <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Welcome to Ur Library Management System!!!!!!
            </Typography>
            <Typography align="center" color="textSecondary" sx={{ mb: 2 }}>
                This is an online Library management system which helps you to monitor and control the transactions in the library.
                Through this a library user can find the books, request the books, return the books etc...
            </Typography>
            <Typography align="center" color="textSecondary">
                A simple, user-friendly, and feature-rich modern library management system.
            </Typography>
        </Box>
    </Box>
);

export default Home;