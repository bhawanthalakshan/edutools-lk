import api from './api';

// Fetch past papers with filters & search
export const getPastPapers = async (params = {}) => {
  const response = await api.get('/past-papers', { params });
  return response.data;
};

// Fetch single past paper by slug
export const getPastPaperBySlug = async (slug) => {
  const response = await api.get(`/past-papers/slug/${slug}`);
  return response.data;
};

// Construct API download URL
export const getPastPaperDownloadUrl = (id) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
  return `${baseURL}/past-papers/${id}/download`;
};

// Trigger direct file download & counter increment
export const triggerPastPaperDownload = (id) => {
  const downloadUrl = getPastPaperDownloadUrl(id);
  window.open(downloadUrl, '_blank');
};

// Admin: Upload new past paper (Multipart Form Data)
export const createPastPaper = async (formData) => {
  const response = await api.post('/past-papers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Admin: Update past paper
export const updatePastPaper = async (id, formData) => {
  const isMultipart = formData instanceof FormData;
  const response = await api.put(`/past-papers/${id}`, formData, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

// Admin: Delete past paper
export const deletePastPaper = async (id) => {
  const response = await api.delete(`/past-papers/${id}`);
  return response.data;
};

// Admin: Toggle published / draft status
export const togglePastPaperStatus = async (id) => {
  const response = await api.patch(`/past-papers/${id}/status`);
  return response.data;
};
