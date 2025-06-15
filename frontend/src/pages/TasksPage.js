import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import taskService from '../services/taskService';
import boxService from '../services/boxService';
import { formatDate } from '../utils/dateUtils';

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boxesLoading, setBoxesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Initial form state
  const initialFormState = {
    taskType: 'COLLECTION',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    status: 'PENDING',
    assignedTo: '',
    notes: '',
    relatedBoxId: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // Load tasks and boxes on component mount
  useEffect(() => {
    fetchTasks();
    fetchBoxes();
  }, []);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showSnackbar('שגיאה בטעינת משימות', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch boxes for the dropdown
  const fetchBoxes = async () => {
    try {
      setBoxesLoading(true);
      const data = await boxService.getAllBoxes();
      setBoxes(data);
    } catch (error) {
      console.error('Error fetching boxes:', error);
    } finally {
      setBoxesLoading(false);
    }
  };

  // Filter tasks based on tab and search term
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (task.assignedTo && task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by status based on selected tab
    if (tabValue === 0) return matchesSearch; // All tasks
    if (tabValue === 1) return matchesSearch && task.status === 'PENDING';
    if (tabValue === 2) return matchesSearch && task.status === 'IN_PROGRESS';
    if (tabValue === 3) return matchesSearch && task.status === 'COMPLETED';
    
    return matchesSearch;
  });

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open dialog for adding a new task
  const handleAddTask = () => {
    setCurrentTask(null);
    setFormData(initialFormState);
    setOpenDialog(true);
  };

  // Open dialog for editing an existing task
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setFormData({
      taskType: task.taskType,
      description: task.description,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo || '',
      notes: task.notes || '',
      relatedBoxId: task.relatedBox ? task.relatedBox.id : ''
    });
    setOpenDialog(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Prepare data for API
      const taskData = {
        ...formData,
        relatedBox: formData.relatedBoxId ? { id: formData.relatedBoxId } : null
      };
      
      delete taskData.relatedBoxId;

      if (currentTask) {
        // Update existing task
        await taskService.updateTask(currentTask.id, taskData);
        showSnackbar('המשימה עודכנה בהצלחה');
      } else {
        // Create new task
        await taskService.createTask(taskData);
        showSnackbar('המשימה נוצרה בהצלחה');
      }
      setOpenDialog(false);
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Error saving task:', error);
      showSnackbar('שגיאה בשמירת המשימה', 'error');
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) {
      try {
        await taskService.deleteTask(taskId);
        showSnackbar('המשימה נמחקה בהצלחה');
        fetchTasks(); // Refresh the list
      } catch (error) {
        console.error('Error deleting task:', error);
        showSnackbar('שגיאה במחיקת המשימה', 'error');
      }
    }
  };

  // Update task status
  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      showSnackbar('סטטוס המשימה עודכן בהצלחה');
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Error updating task status:', error);
      showSnackbar('שגיאה בעדכון סטטוס המשימה', 'error');
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // Get color for priority chip
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW':
        return 'default';
      case 'MEDIUM':
        return 'primary';
      case 'HIGH':
        return 'warning';
      case 'URGENT':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get color for status chip
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'info';
      case 'IN_PROGRESS':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get text for task type
  const getTaskTypeText = (type) => {
    switch (type) {
      case 'COLLECTION':
        return 'איסוף';
      case 'TRANSPORT':
        return 'שינוע';
      case 'MAINTENANCE':
        return 'תחזוקה';
      case 'OTHER':
        return 'אחר';
      default:
        return type;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          ניהול משימות
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          startIcon={<AddIcon />}
          onClick={handleAddTask}
        >
          הוסף משימה חדשה
        </Button>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="כל המשימות" />
          <Tab label="ממתינות" />
          <Tab label="בביצוע" />
          <Tab label="הושלמו" />
        </Tabs>
      </Box>

      <TextField
        fullWidth
        margin="normal"
        placeholder="חיפוש לפי תיאור או שם מבצע..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tasks table">
            <TableHead>
              <TableRow>
                <TableCell>סוג</TableCell>
                <TableCell>תיאור</TableCell>
                <TableCell>עדיפות</TableCell>
                <TableCell>סטטוס</TableCell>
                <TableCell>תאריך יעד</TableCell>
                <TableCell>שיוך לארגז</TableCell>
                <TableCell>משויך ל</TableCell>
                <TableCell>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow
                    key={task.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      bgcolor: task.status === 'COMPLETED' ? 'rgba(0,0,0,0.05)' : 'white'
                    }}
                  >
                    <TableCell>{getTaskTypeText(task.taskType)}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
                      <Chip 
                        label={task.priority === 'LOW' ? 'נמוכה' : task.priority === 'MEDIUM' ? 'בינונית' : task.priority === 'HIGH' ? 'גבוהה' : 'דחוף'} 
                        color={getPriorityColor(task.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={task.status === 'PENDING' ? 'ממתינה' : task.status === 'IN_PROGRESS' ? 'בביצוע' : task.status === 'COMPLETED' ? 'הושלמה' : 'בוטלה'} 
                        color={getStatusColor(task.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(task.dueDate)}</TableCell>
                    <TableCell>{task.relatedBox ? task.relatedBox.locationName : '-'}</TableCell>
                    <TableCell>{task.assignedTo || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <IconButton 
                          size="small"
                          onClick={() => handleEditTask(task)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        {task.status !== 'COMPLETED' && (
                          <Tooltip title="סמן כהושלם">
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="success"
                              onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                            >
                              סיים
                            </Button>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    לא נמצאו משימות מתאימות לחיפוש
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentTask ? `עריכת משימה: ${currentTask.description}` : 'הוספת משימה חדשה'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>סוג משימה</InputLabel>
                <Select
                  name="taskType"
                  value={formData.taskType}
                  label="סוג משימה"
                  onChange={handleInputChange}
                >
                  <MenuItem value="COLLECTION">איסוף</MenuItem>
                  <MenuItem value="TRANSPORT">שינוע</MenuItem>
                  <MenuItem value="MAINTENANCE">תחזוקה</MenuItem>
                  <MenuItem value="OTHER">אחר</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>עדיפות</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  label="עדיפות"
                  onChange={handleInputChange}
                >
                  <MenuItem value="LOW">נמוכה</MenuItem>
                  <MenuItem value="MEDIUM">בינונית</MenuItem>
                  <MenuItem value="HIGH">גבוהה</MenuItem>
                  <MenuItem value="URGENT">דחוף</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="תיאור"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="dueDate"
                label="תאריך יעד"
                type="date"
                fullWidth
                variant="outlined"
                value={formData.dueDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>סטטוס</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="סטטוס"
                  onChange={handleInputChange}
                >
                  <MenuItem value="PENDING">ממתינה</MenuItem>
                  <MenuItem value="IN_PROGRESS">בביצוע</MenuItem>
                  <MenuItem value="COMPLETED">הושלמה</MenuItem>
                  <MenuItem value="CANCELLED">בוטלה</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>ארגז קשור</InputLabel>
                <Select
                  name="relatedBoxId"
                  value={formData.relatedBoxId}
                  label="ארגז קשור"
                  onChange={handleInputChange}
                  disabled={boxesLoading}
                >
                  <MenuItem value="">ללא</MenuItem>
                  {boxes.map(box => (
                    <MenuItem key={box.id} value={box.id}>
                      {box.locationName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="assignedTo"
                label="משויך ל"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.assignedTo}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="notes"
                label="הערות"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ביטול</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!formData.description}
          >
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
   </Box>
  );
}

export default TasksPage;
