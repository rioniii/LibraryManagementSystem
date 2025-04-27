import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline, Container } from '@mui/material';

const MainLayout = () => (
    <>
        <CssBaseline />
        <AppBar position="fixed" color="primary">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        color: 'inherit',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        letterSpacing: 1,
                    }}
                >
                    UrLMS
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" component={RouterLink} to="/">Home</Button>
                    <Button color="inherit" component={RouterLink} to="/about">About</Button>
                    <Button color="inherit" component={RouterLink} to="/contact">Contact</Button>
                </Box>
                <Button color="inherit" sx={{ ml: 2 }} component={RouterLink} to="/login">
                    Login
                </Button>
            </Toolbar>
        </AppBar>
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Container sx={{ mt: 4 }}>
            <Outlet />
        </Container>
    </>
);

export default MainLayout;