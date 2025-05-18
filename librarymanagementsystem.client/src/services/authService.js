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

    let userToStore = data.user;

    // If data.user is not provided by API or doesn't have roles, try decoding token
    if (!userToStore || !userToStore.roles) {
      try {
        const decodedToken = jwtDecode(data.token);
        // Assuming roles are in 'role' or 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' claims
        const roles = decodedToken.role || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        // Ensure roles is an array
        const roleArray = Array.isArray(roles) ? roles : (roles ? [roles] : []);

        if (userToStore) {
            userToStore = { ...userToStore, roles: roleArray };
        } else {
            userToStore = { ...decodedToken, roles: roleArray };
        }

      } catch (e) {
        console.error("Failed to decode token or extract roles:", e);
        // If decoding fails or roles are not found, store just the available user data or decoded token
        if (!userToStore) {
            userToStore = decodedToken || {};
        }
      }
    }

    localStorage.setItem('user', JSON.stringify(userToStore || {}));
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

    let userToStore = data.user;

    // If data.user is not provided by API or doesn't have roles, try decoding token
    if (!userToStore || !userToStore.roles) {
      try {
        const decodedToken = jwtDecode(data.token);
        // Assuming roles are in 'role' or 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' claims
        const roles = decodedToken.role || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        // Ensure roles is an array
        const roleArray = Array.isArray(roles) ? roles : (roles ? [roles] : []);

        if (userToStore) {
            userToStore = { ...userToStore, roles: roleArray };
        } else {
            userToStore = { ...decodedToken, roles: roleArray };
        }

      } catch (e) {
        console.error("Failed to decode token or extract roles:", e);
         // If decoding fails or roles are not found, store just the available user data or decoded token
        if (!userToStore) {
            userToStore = decodedToken || {};
        }
      }
    }

    localStorage.setItem('user', JSON.stringify(userToStore || {}));
    return data;
  },
  getCurrentUser() {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') return null;
    try {
      return JSON.parse(user);
    } catch (e) {
      console.error("Failed to parse user from local storage:", e);
      return null;
    }
  },
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.roles?.includes('Admin');
  },
  isUser() {
    const user = this.getCurrentUser();
    return user?.roles?.includes('User');
  },
  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
export default authService; 