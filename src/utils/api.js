import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  headers: { 'Content-type': 'application/json' },
});

const fetchRequest = (requestConfig) => {
  try {
    return axiosClient(requestConfig);
  } catch (error) {
    console.error(error);
  }
};

// image module api
export const API_IMAGE = {
  getAllImages: async () => {
    const config = {
      method: 'get',
      url: `/image/`,
    };
    return fetchRequest(config);
  },
}

// tag module api
export const API_TAG = {
  getPaginatedTags: async (page = '') => {
    const config = {
      method: 'get',
      url: page ? `/image-tag/?page=${page}` : '/image-tag/',
    };
    return fetchRequest(config);
  },
  getAllTags: async () => {
    const config = {
      method: 'get',
      url: `/image-tag/all_tags/`,
    };
    return fetchRequest(config);
  },
  createTag: async (payload) => {
    const config = {
      method: 'post',
      url: '/image-tag/',
      data: JSON.stringify(payload),
    };
    return fetchRequest(config);
  },
  updateTag: async (id, payload) => {
    const config = {
      method: 'put',
      url: `/image-tag/${id}/`,
      data: JSON.stringify(payload),
    };
    return fetchRequest(config);
  },
  deleteTag: async (id) => {
    const config = {
      method: 'delete',
      url: `/image-tag/${id}/`,
    };
    return fetchRequest(config);
  },
};