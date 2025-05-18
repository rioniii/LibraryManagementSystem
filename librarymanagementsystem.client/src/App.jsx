import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import ManageUsersPage from './pages/ManageUsersPage';
import ManageBooksPage from './pages/ManageBooksPage';
import ManageBookLoansPage from './pages/ManageBookLoansPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import BorrowedBooksPage from './pages/BorrowedBooksPage';
import BooksPage from './pages/BooksPage';
import DashboardSettingsPage from './pages/DashboardSettingsPage';
import { ThemeContextProvider } from './ThemeContext';

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <Navbar />
      <Box sx={{ pt: 8 }}> {/* Add padding top to account for fixed navbar */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public Books Route */}
          <Route path="/books" element={<BooksPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-books"
            element={
              <ProtectedRoute>
                <BorrowedBooksPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<ManageUsersPage />} />
            <Route path="books" element={<ManageBooksPage />} />
            <Route path="loans" element={<ManageBookLoansPage />} />
            <Route path="categories" element={<ManageCategoriesPage />} />
            <Route path="settings" element={<DashboardSettingsPage />} />
          </Route>
        </Routes>
      </Box>
    </ThemeContextProvider>
  );
}

export default App;
