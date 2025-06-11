import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ConstructionIcon from '@mui/icons-material/Construction';
import boxService from '../services/boxService';
import taskService from '../services/taskService';
import transportService from '../services/transportService';
import { formatDate, isToday } from '../utils/dateUtils';

function Dashboard() {
  const [boxCount, setBoxCount] = useState({ total: 0, active: 0, maintenance: 0, inactive: 0 });
  const [taskCount, setTaskCount] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0, maintenance: 0 });
  const [transportCount, setTransportCount] = useState({ total: 0, planned: 0, inProgress: 0, completed: 0 });
  const [todayTasks, setTodayTasks] = useState([]);
  const [todayTransports, setTodayTransports] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch boxes
      const boxes = await boxService.getAllBoxes();
      setBoxCount({
        total: boxes.length,
        active: boxes.filter(box => box.status === 'ACTIVE').length,
        maintenance: boxes.filter(box => box.status === 'MAINTENANCE').length,
        inactive: boxes.filter(box => box.status === 'INACTIVE').length
      });
      
      // Fetch tasks
      const tasks = await taskService.getAllTasks();
setTaskCount({
  total: tasks.length,
  pending: tasks.filter(task => task.status === 'PENDING').length,
  inProgress: tasks.filter(task => task.status === 'IN_PROGRESS').length,
  completed: tasks.filter(task => task.status === 'COMPLETED').length,
  overdue: tasks.filter(task => task.isOverdue).length,
  maintenance: tasks.filter(task => task.taskType === 'MAINTENANCE').length 
});
      
      // Set today's tasks
      const todayTasksList = tasks.filter(task => isToday(task.dueDate));
      setTodayTasks(todayTasksList.slice(0, 5)); // Get top 5 tasks for today
      
      // Fetch transports
      const transports = await transportService.getAllTransports();
      setTransportCount({
        total: transports.length,
        planned: transports.filter(transport => transport.status === 'PLANNED').length,
        inProgress: transports.filter(transport => transport.status === 'IN_PROGRESS').length,
        completed: transports.filter(transport => transport.status === 'COMPLETED').length
      });
      
      // Set today's transports
      const todayTransportsList = transports.filter(transport => isToday(transport.scheduledDate));
      setTodayTransports(todayTransportsList.slice(0, 5)); // Get top 5 transports for today
      
      // Create recent activity list by combining and sorting tasks and transports
      const combinedActivity = [
        ...tasks.map(task => ({
          id: 'task-' + task.id,
          type: 'task',
          title: task.description,
          date: task.updatedAt,
          status: task.status
        })),
        ...transports.map(transport => ({
          id: 'transport-' + transport.id,
          type: 'transport',
          title: `שינוע מ${transport.sourceBox ? transport.sourceBox.locationName : 'לא ידוע'} ל${transport.destinationType === 'BOX' && transport.destinationBox ? transport.destinationBox.locationName : transport.destinationName || 'לא ידוע'}`,
          date: transport.updatedAt,
          status: transport.status
        }))
      ];
      
      // Sort by date (newest first) and get the top 10
      const sortedActivity = combinedActivity
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
      
      setRecentActivity(sortedActivity);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status, type) => {
    if (type === 'task') {
      switch (status) {
        case 'PENDING': return 'info';
        case 'IN_PROGRESS': return 'warning';
        case 'COMPLETED': return 'success';
        case 'CANCELLED': return 'error';
        default: return 'default';
      }
    } else {
      switch (status) {
        case 'PLANNED': return 'info';
        case 'IN_PROGRESS': return 'warning';
        case 'COMPLETED': return 'success';
        case 'CANCELLED': return 'error';
        default: return 'default';
      }
    }
  };

  const getStatusText = (status, type) => {
    if (type === 'task') {
      switch (status) {
        case 'PENDING': return 'ממתינה';
        case 'IN_PROGRESS': return 'בביצוע';
        case 'COMPLETED': return 'הושלמה';
        case 'CANCELLED': return 'בוטלה';
        default: return status;
      }
    } else {
      switch (status) {
        case 'PLANNED': return 'מתוכנן';
        case 'IN_PROGRESS': return 'בביצוע';
        case 'COMPLETED': return 'הושלם';
        case 'CANCELLED': return 'בוטל';
        default: return status;
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        לוח בקרה
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Boxes Summary */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#F8A444', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                  ארגזים
                </Typography>
                <InventoryIcon fontSize="large" />
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                {boxCount.total}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  פעילים: {boxCount.active}
                </Typography>
                <Typography variant="body2">
                  בתחזוקה: {boxCount.maintenance}
                </Typography>
                <Typography variant="body2">
                  לא פעילים: {boxCount.inactive}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tasks Summary */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#305076', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                  משימות
                </Typography>
                <AssignmentIcon fontSize="large" />
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                {taskCount.total}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  ממתינות: {taskCount.pending}
                </Typography>
                <Typography variant="body2">
                  בביצוע: {taskCount.inProgress}
                </Typography>
                <Typography variant="body2">
                  הושלמו: {taskCount.completed}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ff9e80' }}>
                  באיחור: {taskCount.overdue}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Transports Summary */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#51B5AE', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                  שינועים
                </Typography>
                <LocalShippingIcon fontSize="large" />
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                {transportCount.total}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  מתוכננים: {transportCount.planned}
                </Typography>
                <Typography variant="body2">
                  בביצוע: {transportCount.inProgress}
                </Typography>
                <Typography variant="body2">
                  הושלמו: {transportCount.completed}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Maintenance Summary */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#4a5568', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                  תחזוקה
                </Typography>
                <ConstructionIcon fontSize="large" />
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                {boxCount.maintenance}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  ארגזים בתחזוקה
                </Typography>
                <Typography variant="body2">
                  משימות תחזוקה: {taskCount.maintenance}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Today's Activities and Recent Activity */}
      <Grid container spacing={3}>
        {/* Today's Tasks */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              משימות להיום
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {todayTasks.length > 0 ? (
              <List dense>
                {todayTasks.map((task) => (
                  <ListItem key={task.id}>
                    <ListItemIcon>
                      {task.status === 'COMPLETED' ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <ScheduleIcon color={task.priority === 'URGENT' || task.priority === 'HIGH' ? 'error' : 'primary'} />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={task.description} 
                      secondary={`משויך ל: ${task.assignedTo || 'לא משויך'}`}
                    />
                    <Chip 
                      label={task.priority === 'LOW' ? 'נמוכה' : task.priority === 'MEDIUM' ? 'בינונית' : task.priority === 'HIGH' ? 'גבוהה' : 'דחוף'} 
                      color={task.priority === 'LOW' ? 'default' : task.priority === 'MEDIUM' ? 'primary' : task.priority === 'HIGH' ? 'warning' : 'error'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" align="center" color="textSecondary" sx={{ py: 2 }}>
                אין משימות מתוכננות להיום
              </Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button 
                component={Link} 
                to="/tasks" 
                variant="outlined" 
                color="primary"
              >
                לכל המשימות
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Today's Transports */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              שינועים להיום
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {todayTransports.length > 0 ? (
              <List dense>
                {todayTransports.map((transport) => (
                  <ListItem key={transport.id}>
                    <ListItemIcon>
                      {transport.status === 'COMPLETED' ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <LocalShippingIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={`מ${transport.sourceBox ? transport.sourceBox.locationName : 'לא ידוע'} ל${transport.destinationType === 'BOX' && transport.destinationBox ? transport.destinationBox.locationName : transport.destinationName || 'לא ידוע'}`} 
                      secondary={transport.quantity || 'ללא פירוט כמות'}
                    />
                    <Chip 
                      label={transport.status === 'PLANNED' ? 'מתוכנן' : transport.status === 'IN_PROGRESS' ? 'בביצוע' : transport.status === 'COMPLETED' ? 'הושלם' : 'בוטל'} 
                      color={getStatusColor(transport.status, 'transport')}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" align="center" color="textSecondary" sx={{ py: 2 }}>
                אין שינועים מתוכננים להיום
              </Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button 
                component={Link} 
                to="/transports" 
                variant="outlined" 
                color="primary"
              >
                לכל השינועים
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              פעילות אחרונה
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {recentActivity.length > 0 ? (
              <List dense>
                {recentActivity.map((activity) => (
                  <ListItem key={activity.id}>
                    <ListItemIcon>
                      {activity.type === 'task' ? (
                        <AssignmentIcon color={activity.status === 'COMPLETED' ? 'success' : 'primary'} />
                      ) : (
                        <LocalShippingIcon color={activity.status === 'COMPLETED' ? 'success' : 'primary'} />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={activity.title} 
                      secondary={`${formatDate(activity.date)} - ${getStatusText(activity.status, activity.type)}`}
                    />
                    <Chip 
                      label={activity.type === 'task' ? 'משימה' : 'שינוע'} 
                      color={activity.type === 'task' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" align="center" color="textSecondary" sx={{ py: 2 }}>
                אין פעילות אחרונה להצגה
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;