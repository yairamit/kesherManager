import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  Chip, 
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import NoteIcon from '@mui/icons-material/Note';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { formatDate } from '../../utils/dateUtils';

/**
 * Component for displaying detailed information about a task
 * 
 * @param {Object} props
 * @param {Object} props.task - The task data to display
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onComplete - Function to call when complete button is clicked
 * @param {Function} props.onClose - Function to call when close button is clicked
 */
function TaskDetails({ task, onEdit, onComplete, onClose }) {
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

  // Get text for status
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'ממתינה';
      case 'IN_PROGRESS':
        return 'בביצוע';
      case 'COMPLETED':
        return 'הושלמה';
      case 'CANCELLED':
        return 'בוטלה';
      default:
        return status;
    }
  };

  // Get color for priority
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

  // Get text for priority
  const getPriorityText = (priority) => {
    switch (priority) {
      case 'LOW':
        return 'נמוכה';
      case 'MEDIUM':
        return 'בינונית';
      case 'HIGH':
        return 'גבוהה';
      case 'URGENT':
        return 'דחוף';
      default:
        return priority;
    }
  };

  if (!task) {
    return null;
  }

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header with task description and status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          {task.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label={getPriorityText(task.priority)} 
            color={getPriorityColor(task.priority)}
          />
          <Chip 
            label={getStatusText(task.status)} 
            color={getStatusColor(task.status)}
          />
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Task details */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body1">
              סוג משימה: {getTaskTypeText(task.taskType)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PriorityHighIcon sx={{ mr: 1, color: getPriorityColor(task.priority) }} />
            <Typography variant="body1">
              עדיפות: {getPriorityText(task.priority)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EventIcon sx={{ mr: 1, color: task.isOverdue ? 'error.main' : 'primary.main' }} />
            <Typography variant="body1" color={task.isOverdue ? 'error' : 'inherit'}>
              תאריך יעד: {formatDate(task.dueDate) || 'לא צוין'}
              {task.isOverdue && ' (באיחור)'}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body1">
              משויך ל: {task.assignedTo || 'לא משויך'}
            </Typography>
          </Box>
        </Grid>
        
        {task.relatedBox && (
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                ארגז קשור: {task.relatedBox.locationName}
              </Typography>
            </Box>
          </Grid>
        )}
        
        {task.relatedTransport && (
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalShippingIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                שינוע קשור: {task.relatedTransport.id}
              </Typography>
            </Box>
          </Grid>
        )}
        
        {task.notes && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <NoteIcon sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
              <Typography variant="body1">
                הערות: {task.notes}
              </Typography>
            </Box>
          </Grid>
        )}
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              נוצר בתאריך: {formatDate(task.createdAt)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              עודכן בתאריך: {formatDate(task.updatedAt)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      {/* Action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          סגור
        </Button>
        {task.status !== 'COMPLETED' && (
          <Button 
            variant="contained"
            color="success"
            onClick={() => onComplete(task.id)}
          >
            סמן כהושלם
          </Button>
        )}
        <Button 
          variant="contained"
          color="primary"
          onClick={() => onEdit(task)}
        >
          ערוך משימה
        </Button>
      </Box>
    </Paper>
  );
}

export default TaskDetails;
