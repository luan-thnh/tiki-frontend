import axiosClient from './axiosClient';

export const findAllSuggests = async () => {
  const res = await axiosClient.get('/suggests');

  return res.data;
};

export const addToKeyWord = async (keyword) => {
  const res = await axiosClient.post('/suggests', { keyword });

  return res.data;
};
