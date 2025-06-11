import api from './api';

const transportService = {
  // Get all transports
  getAllTransports: async () => {
    const response = await api.get('/api/transports');
    return response.data;
  },

  // Get transport by ID
  getTransportById: async (id) => {
    const response = await api.get(`/api/transports/${id}`);
    return response.data;
  },

  // Create new transport
  createTransport: async (transportData) => {
    const response = await api.post('/api/transports', transportData);
    return response.data;
  },

  // Update existing transport
  updateTransport: async (id, transportData) => {
    const response = await api.put(`/api/transports/${id}`, transportData);
    return response.data;
  },

  // Delete transport
  deleteTransport: async (id) => {
    const response = await api.delete(`/api/transports/${id}`);
    return response.data;
  },

  // Get transports by status
  getTransportsByStatus: async (status) => {
    const response = await api.get(`/api/transports/status/${status}`);
    return response.data;
  },

  // Get transports scheduled for today
  getTodayTransports: async () => {
    const response = await api.get('/api/transports/today');
    return response.data;
  },

  // Complete a transport
  completeTransport: async (transportId, completionData) => {
    const response = await api.patch(`/api/transports/${transportId}/complete`, completionData);
    return response.data;
  },

  // Update transport status
  updateTransportStatus: async (transportId, status) => {
    const response = await api.patch(`/api/transports/${transportId}/status`, { status });
    return response.data;
  }
};

export default transportService;
