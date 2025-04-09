import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Books API
export const fetchBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addBook = async (bookData) => {
  try {
    const response = await axios.post(`${API_URL}/books/add`, bookData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBook = async (bookId) => {
  try {
    const response = await axios.delete(`${API_URL}/books/${bookId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Issue Request API
export const requestBook = async (bookId) => {
  try {
    const response = await axios.post(`${API_URL}/requests/request/${bookId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin: Approve book request
export const approveRequest = async (requestId) => {
  try {
    const response = await axios.post(`${API_URL}/requests/approve/${requestId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin: Reject book request
export const rejectRequest = async (requestId, message = "") => {
  try {
    const response = await axios.post(`${API_URL}/requests/reject/${requestId}`, { message });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Original issue function (now for admin use)
export const issueBook = async (bookId) => {
  try {
    const response = await axios.post(`${API_URL}/issues/issue/${bookId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const returnBook = async (bookId) => {
  try {
    const response = await axios.post(`${API_URL}/issues/return/${bookId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserIssues = async () => {
  try {
    const response = await axios.get(`${API_URL}/issues/my`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all issue requests (for admin)
export const getAllRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/requests/requests`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllIssues = async () => {
  try {
    const response = await axios.get(`${API_URL}/issues/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user's issue requests
export const getUserRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/requests/my-requests`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 