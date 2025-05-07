import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import {
  Book as BookIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        height: '100%',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const stats = [
    {
      title: 'Total Books',
      value: '1,234',
      icon: <BookIcon sx={{ fontSize: 40 }} />,
      color: 'primary'
    },
    {
      title: 'Active Users',
      value: '456',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: 'success'
    },
    {
      title: 'Categories',
      value: '24',
      icon: <CategoryIcon sx={{ fontSize: 40 }} />,
      color: 'warning'
    },
    {
      title: 'Borrowed Books',
      value: '89',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: 'error'
    }
  ];

  return (
    <Box>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4,
          color: 'text.primary',
          fontWeight: 600
        }}
      >
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              height: '400px'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {/* Add your activity chart or list here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              height: '400px'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            {/* Add your quick actions here */}
          </Paper>
        </Grid>
      </Grid>

      <Button
        component={RouterLink}
        to="/dashboard"
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default Dashboard; 