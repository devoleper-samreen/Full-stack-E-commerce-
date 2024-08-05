import axiosInstance from './axiosInstance';

export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axiosInstance.post('/login', userData);
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await axiosInstance.get('/user-profile');
  return response.data;
};
