// utils.js
import {jwtDecode} from 'jwt-decode';

export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
    }
  }
  return null;
};
