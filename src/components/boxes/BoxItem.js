import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  IconButton, 
  Chip,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate } from '../../utils/dateUtils';

/**
 * Component for displaying a single box card
 * 
 * @param {Object} props
 * @param {Object} props.box - The box data to display
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDelete - Function to call when delete button is clicked
 */
function BoxItem({ box, onEdit, onDelete }) {
  // Get color for status chip
  const getStatusColor = (status) => {
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
  };

  // Get text for status
  const getStatusText = (status) => {
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
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: box.status === 'INACTIVE' ? 'rgba(0,0,0,0.05)' : 'white' 
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="h2">
            {box.locationName}
          </Typography>
          <Chip 
            label={getStatusText(box.status)} 
            color={getStatusColor(box.status)}
            size="small"
          />
        </Box>
        
        {box.address && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            כתובת: {box.address}
          </Typography>
        )}
        
        {box.notes && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            הערות: {box.notes}
          </Typography>
        )}
        
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
          עודכן בתאריך: {formatDate(box.updatedAt)}
        </Typography>
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          startIcon={<EditIcon />}
          onClick={onEdit}
        >
          ערוך
        </Button>
        <IconButton 
          color="error" 
          size="small"
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default BoxItem;
