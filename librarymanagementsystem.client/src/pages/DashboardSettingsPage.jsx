import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  FormControlLabel,
  Switch,
  Divider,
  Grid
} from '@mui/material';
import { useThemeContext } from '../ThemeContext';

const DashboardSettingsPage = () => {
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard Settings
      </Typography>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Appearance</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={<Switch checked={mode === 'dark'} onChange={toggleColorMode} />}
            label="Enable Dark Mode"
          />
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Other Settings</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Option 1 Placeholder</Typography>
            {/* Add a control for Option 1 */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Option 2 Placeholder</Typography>
            {/* Add a control for Option 2 */}
          </Grid>
          {/* Add more settings options as needed */}
        </Grid>

      </Paper>
    </Container>
  );
};

export default DashboardSettingsPage; 