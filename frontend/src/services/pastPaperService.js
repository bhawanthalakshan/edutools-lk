import api from './api';

// Fetch past papers with server-side filters & pagination
export const getPastPapers = async (params = {}) => {
  const response = await api.get('/past-papers', { params });
  return response.data;
};

// Fetch aggregate past paper stats for hub & admin
export const getPastPaperStats = async (params = {}) => {
  const response = await api.get('/past-papers/stats', { params });
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

// --- SUBJECT API SERVICES ---

export const getSubjects = async (params = {}) => {
  const response = await api.get('/subjects', { params });
  return response.data;
};

export const getSubjectBySlug = async (examType, slug) => {
  const response = await api.get(`/subjects/${examType}/${slug}`);
  return response.data;
};

export const createSubject = async (data) => {
  const response = await api.post('/subjects', data);
  return response.data;
};

export const updateSubject = async (id, data) => {
  const response = await api.put(`/subjects/${id}`, data);
  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await api.delete(`/subjects/${id}`);
  return response.data;
};

// --- UNIVERSITY HIERARCHY API SERVICES ---

export const getUniversities = async (params = {}) => {
  const response = await api.get('/universities', { params });
  return response.data;
};

export const getUniversityBySlug = async (slug) => {
  const response = await api.get(`/universities/slug/${slug}`);
  return response.data;
};

export const createUniversity = async (data) => {
  const response = await api.post('/universities', data);
  return response.data;
};

export const getCourses = async (params = {}) => {
  const response = await api.get('/universities/courses', { params });
  return response.data;
};

export const createCourse = async (data) => {
  const response = await api.post('/universities/courses', data);
  return response.data;
};

export const getModules = async (params = {}) => {
  const response = await api.get('/universities/modules', { params });
  return response.data;
};

export const createModule = async (data) => {
  const response = await api.post('/universities/modules', data);
  return response.data;
};

// --- ADMIN PAST PAPER ACTIONS ---

export const createPastPaper = async (formData) => {
  const response = await api.post('/past-papers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePastPaper = async (id, formData) => {
  const isMultipart = formData instanceof FormData;
  const response = await api.put(`/past-papers/${id}`, formData, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const deletePastPaper = async (id) => {
  const response = await api.delete(`/past-papers/${id}`);
  return response.data;
};

export const togglePastPaperStatus = async (id) => {
  const response = await api.patch(`/past-papers/${id}/status`);
  return response.data;
};

export const autoImportPastPapers = async (data = { startYear: 2016, endYear: 2025, batchSize: 10, cursor: 0 }) => {
  const response = await api.post('/past-papers/auto-import', data);
  return response.data;
};
