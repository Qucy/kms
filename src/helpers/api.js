import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  headers: { 'Content-type': 'application/json' },
});

const getRequestAPI = (path, options) => {
  try {
    const getRequestConfig = {
      method: 'get',
      url: path,
      ...options,
    };
    return axiosClient(getRequestConfig);
  } catch (error) {
    console.error(error);
  }
};

const postRequestAPI = (path, payload, options) => {
  try {
    const postRequestConfig = {
      method: 'post',
      url: path,
      data: payload,
      ...options,
    };
    return axiosClient(postRequestConfig);
  } catch (error) {
    console.error(error);
  }
};

export const API_TAG = {
  fetchAll: async () => {
    return getRequestAPI('/image-tag/');
  },
};
