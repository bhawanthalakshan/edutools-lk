import api from './api';

export const getCategories = async (type = '') => {
  const response = await api.get(`/categories${type ? `?type=${type}` : ''}`);
  return response.data;
};

export const getCategoryBySlug = async (slug) => {
  const response = await api.get(`/categories/slug/${slug}`);
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};
