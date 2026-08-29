import api from './api';

export const getArticles = async (params = {}) => {
  const { search = '', category = '', page = 1, limit = 10 } = params;
  const queryParams = new URLSearchParams();

  if (search) queryParams.append('search', search);
  if (category) queryParams.append('category', category);
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);

  const response = await api.get(`/articles?${queryParams.toString()}`);
  return response.data;
};

export const getArticleBySlug = async (slug) => {
  const response = await api.get(`/articles/${slug}`);
  return response.data;
};
