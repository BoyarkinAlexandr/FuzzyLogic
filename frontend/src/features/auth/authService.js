import axios from "axios";

const BACKEND_DOMAIN = "http://localhost:8000";

// API Endpoints
const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`;
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`;
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`;
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`;
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`;
const GET_USER_INFO = `${BACKEND_DOMAIN}/api/v1/auth/users/me/`;

// Utility function to configure headers
const getHeaders = (isAuthenticated = false, token = null) => {
  const headers = {
    "Content-type": "application/json",
  };
  if (isAuthenticated && token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return { headers };
};

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(REGISTER_URL, userData, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error.response?.data || error.message);
    throw error;
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(LOGIN_URL, userData, getHeaders());
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
};

// Activate account
const activate = async (userData) => {
  try {
    const response = await axios.post(ACTIVATE_URL, userData, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Activation Error:", error.response?.data || error.message);
    throw error;
  }
};

// Reset password
const resetPassword = async (userData) => {
  try {
    const response = await axios.post(RESET_PASSWORD_URL, userData, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Reset Password Error:", error.response?.data || error.message);
    throw error;
  }
};

// Confirm password reset
const resetPasswordConfirm = async (userData) => {
  try {
    const response = await axios.post(
      RESET_PASSWORD_CONFIRM_URL,
      userData,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Reset Password Confirm Error:", error.response?.data || error.message);
    throw error;
  }
};

// Get user info
const getUserInfo = async (accessToken) => {
  try {
    const response = await axios.get(GET_USER_INFO, getHeaders(true, accessToken));
    return response.data;
  } catch (error) {
    console.error("Get User Info Error:", error.response?.data || error.message);
    throw error;
  }
};

// Export authService
const authService = {
  register,
  login,
  logout,
  activate,
  resetPassword,
  resetPasswordConfirm,
  getUserInfo,
};

export default authService;