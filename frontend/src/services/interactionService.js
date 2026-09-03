import api from './api';

export const createPaperRequest = async (requestData) => {
  const response = await api.post('/interactions/requests', requestData);
  return response.data;
};

export const submitPaperContribution = async (formData) => {
  const response = await api.post('/interactions/contributions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const createContentReport = async (reportData) => {
  const response = await api.post('/interactions/reports', reportData);
  return response.data;
};

export const getExamSchedules = async () => {
  const response = await api.get('/interactions/schedules');
  return response.data;
};

// Admin Moderation API calls
export const getAdminPaperRequests = async (status = '') => {
  const response = await api.get(`/interactions/requests${status ? `?status=${status}` : ''}`);
  return response.data;
};

export const updatePaperRequestStatus = async (id, data) => {
  const response = await api.put(`/interactions/requests/${id}`, data);
  return response.data;
};

export const getAdminPaperContributions = async (status = '') => {
  const response = await api.get(`/interactions/contributions${status ? `?status=${status}` : ''}`);
  return response.data;
};

export const moderatePaperContribution = async (id, data) => {
  const response = await api.put(`/interactions/contributions/${id}`, data);
  return response.data;
};

export const getAdminContentReports = async (status = '') => {
  const response = await api.get(`/interactions/reports${status ? `?status=${status}` : ''}`);
  return response.data;
};

export const updateContentReportStatus = async (id, data) => {
  const response = await api.put(`/interactions/reports/${id}`, data);
  return response.data;
};

export const createOrUpdateExamSchedule = async (scheduleData) => {
  const response = await api.post('/interactions/schedules', scheduleData);
  return response.data;
};
