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

const axiosImageClient = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  headers: { 'content-type': 'multipart/form-data' },
});

const fetchImageRequest = (requestConfig) => {
  try {
    return axiosImageClient(requestConfig);
  } catch (error) {
    console.error(error);
  }
};

// image module api
export const API_IMAGE = {
  getPaginatedImages: async (page = '') => {
    const config = {
      method: 'get',
      url: page ? `/image/?page=${page}` : `/image/`
    };
    return fetchRequest(config);
  },
  createImage: async (payload) => {
    console.log(JSON.stringify(payload))
    const config = {
      method: 'post',
      url: `/image/`,
      data: payload,
    };
    return fetchImageRequest(config);
  }
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

// ImageTagLink API
export const API_IMAGETAGLINK = {
  getImagesIDbyTagID: async (tag_id = '') => {
    const config = {
      method: 'get',
      url: `/image-tag-link/?tag_id=${tag_id}`
    };
    return fetchRequest(config);
  },
  getTagIDbyImagesID: async (image_ids = '') => {
    const config = {
      method: 'get',
      url: `/image-tag-link/?image_ids=${image_ids}`
    };
    return fetchRequest(config);
  },

  createImageTagLink: async (payload) => {
    console.log(JSON.stringify(payload))
    const config = {
      method: 'post',
      url: `/image-tag-link/`,
      data: payload,
    };
    return fetchRequest(config);
  }
}