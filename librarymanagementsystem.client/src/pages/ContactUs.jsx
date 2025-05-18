import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Toolbar,
  useTheme,
  useMediaQuery,
  Snackbar
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  AccessTime
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      // Send form data to the backend ContactController
      const response = await axios.post('http://localhost:5022/api/Contact', formData);
      
      console.log('Contact form submission successful:', response.data);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      console.error('Error sending contact form:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  const contactInfo = [
    {
      icon: <LocationOn sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Address',
      content: '123 Library Street, Knowledge City, 10001',
    },
    {
      icon: <Phone sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
    },
    {
      icon: <Email sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Email',
      content: 'contact@globaldigitallibrary.com',
    },
    {
      icon: <AccessTime sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Working Hours',
      content: 'Monday - Friday: 9:00 AM - 6:00 PM',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Toolbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{ 
            color: 'primary.main',
            fontWeight: 600,
            mb: 6
          }}
        >
          Contact Us
        </Typography>

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                height: '100%',
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 600,
                  mb: 4
                }}
              >
                Get in Touch
              </Typography>

              <Box sx={{ display: 'grid', gap: 3 }}>
                {contactInfo.map((info, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2
                    }}
                  >
                    {info.icon}
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'text.primary',
                          fontWeight: 600,
                          mb: 0.5
                        }}
                      >
                        {info.title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                      >
                        {info.content}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 600,
                  mb: 4
                }}
              >
                Send us a Message
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ 
                    py: 1.5,
                    px: 4,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Send Message
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Message sent successfully!"
      />
    </Box>
  );
};

export default ContactUs; 