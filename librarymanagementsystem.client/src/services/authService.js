import { jwtDecode } from "jwt-decode";

const authService = {
  async login(email, password) {
    const response = await fetch('http://localhost:5022/api/Account/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    localStorage.setItem('token', data.token);
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      const user = jwtDecode(data.token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return data;
  },
  async register(email, password, firstName, lastName) {
    const response = await fetch('http://localhost:5022/api/Account/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    if (!response.ok) throw new Error('Registration failed');
    const data = await response.json();
    localStorage.setItem('token', data.token);
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      const user = jwtDecode(data.token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return data;
  },
  getCurrentUser() {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') return null;
    return JSON.parse(user);
  },
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.roles?.includes('Admin');
  },
  isUser() {
    const user = this.getCurrentUser();
    return user?.roles?.includes('User');
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
export default authService; 