// src/pages/Home.jsx
import React from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Container,
  InputBase,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SchoolIcon from '@mui/icons-material/School'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '80vh',
  background: 'linear-gradient(135deg, #1a237e 0%, #000051 100%)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(8, 0),
  [theme.breakpoints.down('md')]: {
    minHeight: '60vh',
  },
}))

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}))

const Home = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const categories = [
    {
      title: 'Academic Books',
      description: 'Access textbooks and academic resources for all levels of education.',
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
    },
    {
      title: 'Fiction & Literature',
      description: 'Explore our vast collection of novels, short stories, and literary works.',
      icon: <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
    },
    {
      title: 'Digital Resources',
      description: 'Access e-books, audiobooks, and other digital learning materials.',
      icon: <AutoStoriesIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
    },
  ]

  return (
    <Box>
      <Navbar />
      <Toolbar />

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: isMobile ? '2.5rem' : '3.5rem',
                }}
              >
                Discover Knowledge at Your Fingertips
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: isMobile ? '1.25rem' : '1.5rem',
                }}
              >
                Access thousands of books, articles, and resources from anywhere in the
                world.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#fff',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#fff',
                    color: '#fff',
                    '&:hover': {
                      borderColor: '#fff',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66"
                alt="Digital Library"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '15px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Search Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" sx={{ mb: 4, color: 'text.primary' }}>
            Find Your Next Read
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for books, authors, or topics..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button variant="contained" color="primary">
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
                borderRadius: 2,
              },
            }}
          />
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" sx={{ mb: 6, color: 'text.primary' }}>
            Explore Our Collections
          </Typography>
          <Grid container spacing={4}>
            {categories.map((category, index) => (
              <Grid item xs={12} md={4} key={index}>
                <CategoryCard>
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image}
                    alt={category.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {category.icon}
                      <Typography variant="h5" sx={{ ml: 1, color: 'text.primary' }}>
                        {category.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ mb: 3, color: 'text.primary' }}>
                About Our Digital Library
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
                We are committed to providing free and open access to knowledge for everyone.
                Our digital library offers a vast collection of resources, from academic texts
                to popular literature, all available at your fingertips.
              </Typography>
              <Button  variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
                Learn More About Us
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da"
                alt="About Our Library"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '15px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Dashboard Section */}
      {/* <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" sx={{ mb: 4 }}>
            Admin Dashboard
          </Typography>
          <Dashboard />
        </Container>
      </Box> */}
    </Box>
  )
}

export default Home
