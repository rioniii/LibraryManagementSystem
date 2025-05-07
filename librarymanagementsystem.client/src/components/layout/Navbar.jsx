import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Books', path: '/books' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const user = authService.getCurrentUser();

  const isAdmin = user?.roles?.includes('Admin');

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main' }}>
        Global Digital Library
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.label} 
            component={RouterLink} 
            to={item.path}
            sx={{
              color: isActive(item.path) ? 'primary.main' : 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {isAuthenticated && isAdmin && (
          <ListItem 
            key="Dashboard" 
            component={RouterLink} 
            to="/dashboard"
            sx={{
              color: isActive('/dashboard') ? 'primary.main' : 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemText primary="Dashboard" />
          </ListItem>
        )}
        {isAuthenticated ? (
          <>
            {user && (
              <ListItem>
                <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
                  {user.firstName} {user.lastName} ({user.roles?.[0]})
                </Typography>
              </ListItem>
            )}
            <ListItem>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ ml: 2 }}
              >
                Logout
              </Button>
            </ListItem>
          </>
        ) : (
          <ListItem>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Global Digital Library
          </Typography>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  sx={{
                    color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    fontWeight: isActive(item.path) ? 600 : 400,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              {isAuthenticated && isAdmin && (
                <Button
                  key="Dashboard"
                  component={RouterLink}
                  to="/dashboard"
                  color="inherit"
                  sx={{
                    color: isActive('/dashboard') ? 'primary.main' : 'text.primary',
                    fontWeight: isActive('/dashboard') ? 600 : 400,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  Dashboard
                </Button>
              )}
              {isAuthenticated ? (
                <>
                  {user && (
                    <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
                      {user.firstName} {user.lastName} ({user.roles?.[0]})
                    </Typography>
                  )}
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    sx={{ ml: 2 }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  sx={{ ml: 2 }}
                >
                  Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            bgcolor: 'background.paper',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 