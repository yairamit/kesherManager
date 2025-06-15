import React from 'react';
import { Chip } from '@mui/material';

/**
 * Reusable component for displaying status badges
 * 
 * @param {Object} props
 * @param {string} props.status - The status value
 * @param {string} props.type - The entity type ('box', 'task', or 'transport')
 * @param {Object} props.chipProps - Additional props to pass to the Chip component
 */
function StatusBadge({ status, type, chipProps = {} }) {
  // Get color based on status and type
  const getStatusColor = () => {
    if (type === 'box') {
      switch (status) {
        case 'ACTIVE':
          return 'success';
        case 'MAINTENANCE':
          return 'warning';
        case 'INACTIVE':
          return 'error';
        default:
          return 'default';
      }
    } else if (type === 'task') {
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
    } else if (type === 'transport') {
      switch (status) {
        case 'PLANNED':
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
    }
    
    return 'default';
  };

  // Get text based on status and type
  const getStatusText = () => {
    if (type === 'box') {
      switch (status) {
        case 'ACTIVE':
          return 'פעיל';
        case 'MAINTENANCE':
          return 'בתחזוקה';
        case 'INACTIVE':
          return 'לא פעיל';
        default:
          return status;
      }
    } else if (type === 'task') {
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
    } else if (type === 'transport') {
      switch (status) {
        case 'PLANNED':
          return 'מתוכנן';
        case 'IN_PROGRESS':
          return 'בביצוע';
        case 'COMPLETED':
          return 'הושלם';
        case 'CANCELLED':
          return 'בוטל';
        default:
          return status;
      }
    }
    
    return status;
  };

  return (
    <Chip 
      label={getStatusText()} 
      color={getStatusColor()}
      size="small"
      {...chipProps}
    />
  );
}

export default StatusBadge;
