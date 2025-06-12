import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Chip, 
  Divider, 
  CircularProgress,
  Grid,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NoteIcon from '@mui/icons-material/Note';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { formatDate } from '../../utils/dateUtils';
import boxService from '../../services/boxService';
import transportService from '../../services/transportService';

/**
 * Component for displaying detailed information about a box
 * 
 * @param {Object} props
 * @param {number|string} props.boxId - ID of the box to display
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onClose - Function to call when close button is clicked
 */
function BoxDetails({ boxId, onEdit, onClose }) {
  const [box, setBox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [transports, setTransports] = useState({ outgoing: [], incoming: [] });
  const [transportsLoading, setTransportsLoading] = useState(true);

  // Fetch box details
  useEffect(() => {
    const fetchBoxDetails = async () => {
      try {
        setLoading(true);
        const data = await boxService.getBoxById(boxId);
        setBox(data);
      } catch (error) {
        console.error('Error fetching box details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (boxId) {
      fetchBoxDetails();
    }
  }, [boxId]);

  // Fetch related transports
  useEffect(() => {
    const fetchTransports = async () => {
      try {
        setTransportsLoading(true);
        const outgoing = await boxService.getOutgoingTransports(boxId);
        const incoming = await boxService.getIncomingTransports(boxId);
        setTransports({ outgoing, incoming });
      } catch (error) {
        console.error('Error fetching transports:', error);
      } finally {
        setTransportsLoading(false);
      }
    };

    if (boxId && !loading && box) {
      fetchTransports();
    }
  }, [boxId, loading, box]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!box) {
    return (
      <Typography variant="body1" align="center" color="error" sx={{ my: 4 }}>
        לא ניתן לטעון נתוני ארגז
      </Typography>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header with box name and status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          {box.donationGroup}
        </Typography>
        <Chip 
          label={getStatusText(box.status)} 
          color={getStatusColor(box.status)}
        />
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Box details */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body1">
              כתובת: {box.address || 'לא צוינה כתובת'}
            </Typography>
          </Box>
        </Grid>
        
        {box.latitude && box.longitude && (
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                מיקום: {box.latitude}, {box.longitude}
              </Typography>
            </Box>
          </Grid>
        )}
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <NoteIcon sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
            <Typography variant="body1">
              הערות: {box.notes || 'אין הערות'}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              נוצר בתאריך: {formatDate(box.createdAt)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              עודכן בתאריך: {formatDate(box.updatedAt)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      {/* Tabs for transports */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="שינועים יוצאים" />
          <Tab label="שינועים נכנסים" />
        </Tabs>
        
        <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderTop: 0 }}>
          {/* Outgoing transports */}
          {tabValue === 0 && (
            <>
              {transportsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : transports.outgoing.length > 0 ? (
                <List>
                  {transports.outgoing.map((transport) => (
                    <ListItem key={transport.id} divider>
                      <ListItemIcon>
                        <LocalShippingIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          transport.destinationType === 'BOX' && transport.destinationBox
                            ? `ל${transport.destinationBox.donationGroup}`
                            : `ל${transport.destinationName || 'יעד לא ידוע'}`
                        }
                        secondary={`תאריך: ${formatDate(transport.scheduledDate)} | סטטוס: ${transport.status}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" align="center" sx={{ my: 2 }}>
                  אין שינועים יוצאים לארגז זה
                </Typography>
              )}
            </>
          )}
          
          {/* Incoming transports */}
          {tabValue === 1 && (
            <>
              {transportsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : transports.incoming.length > 0 ? (
                <List>
                  {transports.incoming.map((transport) => (
                    <ListItem key={transport.id} divider>
                      <ListItemIcon>
                        <LocalShippingIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`מ${transport.sourceBox ? transport.sourceBox.donationGroup : 'מקור לא ידוע'}`}
                        secondary={`תאריך: ${formatDate(transport.scheduledDate)} | סטטוס: ${transport.status}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" align="center" sx={{ my: 2 }}>
                  אין שינועים נכנסים לארגז זה
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>
      
      {/* Action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          סגור
        </Button>
        <Button 
          variant="contained"
          color="primary"
          onClick={() => onEdit(box)}
        >
          ערוך ארגז
        </Button>
      </Box>
    </Paper>
  );
}

export default BoxDetails;
