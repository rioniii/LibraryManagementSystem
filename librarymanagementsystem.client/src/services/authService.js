import axiosInstance from './axiosConfig';

const authService = {
  async login(email, password) {
    const response = await fetch('http://localhost:5022/api/Account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  },

  async register(email, password, firstName, lastName, contactNumber, address) {
    const response = await fetch('http://localhost:5022/api/Account/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password, 
        firstName, 
        lastName, 
        contactNumber, 
        address 
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Network response was not ok: ${errorResponse.message || response.statusText}`);
    }

    return response.json();
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.roles?.includes('Admin') || false;
  }
};

export default authService; 