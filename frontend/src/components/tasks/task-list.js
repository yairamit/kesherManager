import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  CircularProgress, 
  Box, 
  Typography,
  Chip
} from '@mui/material';
import { formatDate } from '../../utils/dateUtils';

/**
 * Reusable component for displaying a table of tasks
 * 
 * @param {Object} props
 * @param {Array} props.tasks - Array of task objects to display
 * @param {boolean} props.loading - Whether the tasks are currently loading
 * @param {Function} props.renderActions - Function that returns action buttons for each task
 */
function TaskList({ tasks, loading, renderActions }) {
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ my: 4 }}>
        לא נמצאו משימות
      </Typography>
    );
  }

  return (
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
          {tasks.map((task) => (
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
                  label={getPriorityText(task.priority)} 
                  color={getPriorityColor(task.priority)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={getStatusText(task.status)} 
                  color={getStatusColor(task.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{formatDate(task.dueDate)}</TableCell>
              <TableCell>{task.relatedBox ? task.relatedBox.locationName : '-'}</TableCell>
              <TableCell>{task.assignedTo || '-'}</TableCell>
              <TableCell>
                {renderActions && renderActions(task)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TaskList;
