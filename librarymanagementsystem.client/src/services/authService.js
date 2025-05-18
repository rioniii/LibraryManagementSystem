import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const API_URL = 'http://localhost:5022/api/Account';

class AuthService {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Login failed');
    }
  }

  async register(email, password, firstName, lastName, contactNumber, address) {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        firstName,
        lastName,
        contactNumber,
        address
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Registration failed');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        this.logout();
        return null;
      }
    }
    return null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    } catch (e) {
      this.logout();
      return false;
    }
  }

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.roles?.includes('Admin');
  }

  isUser() {
    const user = this.getCurrentUser();
    return user?.roles?.includes('User');
  }

  // Add axios interceptor for token handling
  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
}

const authService = new AuthService();
authService.setupAxiosInterceptors();

export default authService; 