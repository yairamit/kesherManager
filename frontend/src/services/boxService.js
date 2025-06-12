import api from './api';

const boxService = {
  // Get all boxes
  getAllBoxes: async () => {
    const response = await api.get('/api/boxes');
    return response.data;
  },

  // Get box by ID
  getBoxById: async (id) => {
    const response = await api.get(`/api/boxes/${id}`);
    return response.data;
  },

  // Create new box
  createBox: async (boxData) => {
    const response = await api.post('/api/boxes', boxData);
    return response.data;
  },

  // Update existing box
  updateBox: async (id, boxData) => {
    const response = await api.put(`/api/boxes/${id}`, boxData);
    return response.data;
  },

  // Delete box
  deleteBox: async (id) => {
    const response = await api.delete(`/api/boxes/${id}`);
    return response.data;
  },

  // Get boxes by status
  getBoxesByStatus: async (status) => {
    const response = await api.get(`/api/boxes/status/${status}`);
    return response.data;
  },

  // Get outgoing transports for a box
  getOutgoingTransports: async (boxId) => {
    const response = await api.get(`/api/boxes/${boxId}/outgoing-transports`);
    return response.data;
  },

  // Get incoming transports for a box
  getIncomingTransports: async (boxId) => {
    const response = await api.get(`/api/boxes/${boxId}/incoming-transports`);
    return response.data;
  }
};

export default boxService;
