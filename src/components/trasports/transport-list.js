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
 * Reusable component for displaying a table of transports
 * 
 * @param {Object} props
 * @param {Array} props.transports - Array of transport objects to display
 * @param {boolean} props.loading - Whether the transports are currently loading
 * @param {Function} props.renderActions - Function that returns action buttons for each transport
 */
function TransportList({ transports, loading, renderActions }) {
  // Get color for status chip
  const getStatusColor = (status) => {
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
  };

  // Get text for destination type
  const getDestinationTypeText = (type) => {
    switch (type) {
      case 'BOX':
        return 'ארגז';
      case 'STORE':
        return 'חנות';
      case 'FAMILY':
        return 'משפחה';
      default:
        return type;
    }
  };

  // Get text for status
  const getStatusText = (status) => {
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
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!transports || transports.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ my: 4 }}>
        לא נמצאו שינועים
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="transports table">
        <TableHead>
          <TableRow>
            <TableCell>מקור</TableCell>
            <TableCell>סוג יעד</TableCell>
            <TableCell>יעד</TableCell>
            <TableCell>כמות</TableCell>
            <TableCell>תאריך מתוכנן</TableCell>
            <TableCell>סטטוס</TableCell>
            <TableCell>תאריך השלמה</TableCell>
            <TableCell>פעולות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transports.map((transport) => (
            <TableRow
              key={transport.id}
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
                bgcolor: transport.status === 'COMPLETED' ? 'rgba(0,0,0,0.05)' : 'white'
              }}
            >
              <TableCell>{transport.sourceBox ? transport.sourceBox.locationName : '-'}</TableCell>
              <TableCell>{getDestinationTypeText(transport.destinationType)}</TableCell>
              <TableCell>
                {transport.destinationType === 'BOX' && transport.destinationBox 
                  ? transport.destinationBox.locationName
                  : transport.destinationName || '-'}
              </TableCell>
              <TableCell>{transport.quantity || '-'}</TableCell>
              <TableCell>{formatDate(transport.scheduledDate)}</TableCell>
              <TableCell>
                <Chip 
                  label={getStatusText(transport.status)} 
                  color={getStatusColor(transport.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{transport.completionDate ? formatDate(transport.completionDate) : '-'}</TableCell>
              <TableCell>
                {renderActions && renderActions(transport)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransportList;
