import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  IconButton,
  Container,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const BookList = () => {
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(10);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/Book')
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setError('Failed to load books. Please try again later.');
        setLoading(false);
      });
  }, []);

  const filteredBooks = books.filter(book =>
    (book.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (book.author || '').toLowerCase().includes(search.toLowerCase()) ||
    (book.categoryName || '').toLowerCase().includes(search.toLowerCase()) ||
    (book.publisher || '').toLowerCase().includes(search.toLowerCase()) ||
    (book.description || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ maxWidth: 400, mx: 'auto' }}>{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        Book Inventory
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Show</InputLabel>
          <Select
            value={entries}
            label="Show"
            onChange={e => setEntries(e.target.value)}
          >
            {[10, 25, 50, 100].map(num => (
              <MenuItem key={num} value={num}>{num} entries</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 300 } }}
        />
      </Box>

      {filteredBooks.length === 0 && (
        <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 4 }}>
          No books found.
        </Typography>
      )}

      <Grid container spacing={3}>
        {filteredBooks.slice(0, entries).map(book => (
          <Grid item xs={12} sm={6} md={4} key={book.bookId}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 3, transition: 'transform 0.3s ease' }}>
              <CardMedia
                component="img"
                sx={{ height: 200, objectFit: 'contain', pt: 2 }}
                image={book.coverImageURL || 'https://via.placeholder.com/150?text=No+Image'} // Placeholder image
                alt={book.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  by {book.author}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  Genre: {book.categoryName}
                </Typography>
                <Typography variant="body2">
                  Publisher: {book.publisher}
                </Typography>
                <Typography variant="body2">
                  Stock: {book.totalCopies}
                </Typography>
                {book.description && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.disabled', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {book.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BookList; 