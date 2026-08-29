import api from './api';

export const getTools = async (category = '') => {
  const response = await api.get(`/tools${category ? `?category=${category}` : ''}`);
  return response.data;
};

export const getToolBySlug = async (slug) => {
  const response = await api.get(`/tools/${slug}`);
  return response.data;
};
