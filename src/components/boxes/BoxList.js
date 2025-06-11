import React from 'react';
import { Grid, Typography, CircularProgress, Box } from '@mui/material';
import BoxItem from './BoxItem';

/**
 * Reusable component for displaying a grid of boxes
 * 
 * @param {Object} props
 * @param {Array} props.boxes - Array of box objects to display
 * @param {boolean} props.loading - Whether the boxes are currently loading
 * @param {Function} props.onEdit - Function to call when a box is edited
 * @param {Function} props.onDelete - Function to call when a box is deleted
 */
function BoxList({ boxes, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!boxes || boxes.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ my: 4 }}>
        לא נמצאו ארגזים
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {boxes.map((box) => (
        <Grid item xs={12} sm={6} md={4} key={box.id}>
          <BoxItem 
            box={box} 
            onEdit={() => onEdit(box)} 
            onDelete={() => onDelete(box.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default BoxList;
