import axios from 'axios';

let token = localStorage.getItem('token') || null;

const axiosClient = axios.create({
  baseURL: 'http://localhost:3003/api/v1',
  headers: {
    'content-type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

axiosClient.interceptors.request.use((config) => {
  const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
  const tokenExpiration = localStorage.getItem('tokenExpiration');

  // Check if the token is expired
  if (tokenExpiration && tokenExpiration - currentTime < 0) {
    // Token is expired, clear it
    localStorage.removeItem('token');
    localStorage.removeItem('data_user');
    localStorage.removeItem('data_admin');
    localStorage.removeItem('tokenExpiration');
    token = null;
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    // Update the token and its expiration time after a successful response
    if (response?.data && response.data.data?.token) {
      token = response.data.data?.token;

      const tokenExpiration = Date.now() / 1000 + 3600; // Assuming the token is valid for 1 hour
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiration', tokenExpiration);
    }

    return response?.data;
  },
  (error) => {
    // Handle errors here
    return error.response?.data;
  }
);

export default axiosClient;
