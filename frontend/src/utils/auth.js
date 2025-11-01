// utils/auth.js

// Save JWT token to localStorage
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// Get JWT token from localStorage
export const getToken = () => localStorage.getItem("token");

// Check if user is authenticated
export const isAuthenticated = () => !!getToken();

// Remove JWT token (logout)
export const logout = () => {
  localStorage.removeItem("token");
};
