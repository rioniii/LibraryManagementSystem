import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Card, CardMedia, FormControl, InputLabel, Select, MenuItem, TextField
} from '@mui/material';

const BookList = () => {
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(10);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('/api/Book')
      .then(response => setBooks(response.data))
      .catch(error => {
        setBooks([]);
        console.error('Error fetching books:', error);
      });
  }, []);

  const filteredBooks = books.filter(book =>
    (book.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (book.author || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        p: 3,
        width: '100vw',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Book Inventory List
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
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
          />
        </Box>
        <Box>
          {filteredBooks.slice(0, entries).map(book => (
            <Card key={book.bookId} sx={{ display: 'flex', mb: 2, p: 2, alignItems: 'center' }}>
              {/* ID Column */}
              <Box
                sx={{
                  minWidth: 60,
                  maxWidth: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#f0f0f0',
                  borderRadius: 1,
                  height: '100%',
                  mr: 2,
                  p: 1,
                }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  ID
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {book.bookId}
                </Typography>
              </Box>
              {/* Book Details */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{book.title}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                          Author: <b>{book.author}</b> | Genre: <b>{book.categoryName}</b>
                </Typography>
                <Typography variant="body2">
                  Language: <b>English</b> | Publisher: <b>{book.publisher}</b> |
                </Typography>
                <Typography variant="body2">
                         | Actual Stock: <b>{book.totalCopies}</b> | Available: <b>{book.status}</b>
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                  Description: {book.description}
                </Typography>
              </Box>
              {/* Book Cover */}
              <CardMedia
                component="img"
                sx={{ width: 120, objectFit: 'contain', ml: 2 }}
                image={book.coverImageURL}
                alt={book.title}
              />
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default BookList; 