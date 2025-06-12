import api from './api';

const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    const response = await api.get('/api/tasks');
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id) => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
  },

  // Update existing task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  },

  // Get tasks by status
  getTasksByStatus: async (status) => {
    const response = await api.get(`/api/tasks/status/${status}`);
    return response.data;
  },

  // Get tasks by priority
  getTasksByPriority: async (priority) => {
    const response = await api.get(`/api/tasks/priority/${priority}`);
    return response.data;
  },

  // Get overdue tasks
  getOverdueTasks: async () => {
    const response = await api.get('/api/tasks/overdue');
    return response.data;
  },

  // Get tasks for today
  getTodayTasks: async () => {
    const response = await api.get('/api/tasks/today');
    return response.data;
  },

  // Assign task to a person
  assignTask: async (taskId, assignee) => {
    const response = await api.patch(`/api/tasks/${taskId}/assign`, { assignedTo: assignee });
    return response.data;
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    const response = await api.patch(`/api/tasks/${taskId}/status`, { status });
    return response.data;
  }
};

export default taskService;
