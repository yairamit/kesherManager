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
  IconButton,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import boxService from '../services/boxService';
import { formatDate } from '../utils/dateUtils';

function BoxesPage() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBox, setCurrentBox] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Initial form state
  const initialFormState = {
    locationName: '',
    address: '',
    status: 'ACTIVE',
    notes: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // Load boxes on component mount
  useEffect(() => {
    fetchBoxes();
  }, []);

  // Fetch boxes from the API
  const fetchBoxes = async () => {
    try {
      setLoading(true);
      const data = await boxService.getAllBoxes();
      setBoxes(data);
    } catch (error) {
      console.error('Error fetching boxes:', error);
      showSnackbar('שגיאה בטעינת ארגזים', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter boxes based on search term
  const filteredBoxes = boxes.filter(box => 
    box.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (box.address && box.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open dialog for adding a new box
  const handleAddBox = () => {
    setCurrentBox(null);
    setFormData(initialFormState);
    setOpenDialog(true);
  };

  // Open dialog for editing an existing box
  const handleEditBox = (box) => {
    setCurrentBox(box);
    setFormData({
      locationName: box.locationName,
      address: box.address || '',
      status: box.status,
      notes: box.notes || ''
    });
    setOpenDialog(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (currentBox) {
        // Update existing box
        await boxService.updateBox(currentBox.id, formData);
        showSnackbar('הארגז עודכן בהצלחה');
      } else {
        // Create new box
        await boxService.createBox(formData);
        showSnackbar('הארגז נוצר בהצלחה');
      }
      setOpenDialog(false);
      fetchBoxes(); // Refresh the list
    } catch (error) {
      console.error('Error saving box:', error);
      showSnackbar('שגיאה בשמירת הארגז', 'error');
    }
  };

  // Handle box deletion
  const handleDeleteBox = async (boxId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק ארגז זה?')) {
      try {
        await boxService.deleteBox(boxId);
        showSnackbar('הארגז נמחק בהצלחה');
        fetchBoxes(); // Refresh the list
      } catch (error) {
        console.error('Error deleting box:', error);
        showSnackbar('שגיאה במחיקת הארגז', 'error');
      }
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

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          ניהול ארגזים
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          startIcon={<AddIcon />}
          onClick={handleAddBox}
        >
          הוסף ארגז חדש
        </Button>
      </Box>
      
      <TextField
        fullWidth
        margin="normal"
        placeholder="חיפוש לפי שם מיקום או כתובת..."
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
        <Grid container spacing={3}>
          {filteredBoxes.length > 0 ? (
            filteredBoxes.map((box) => (
              <Grid item xs={12} sm={6} md={4} key={box.id}>
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
                        label={box.status === 'ACTIVE' ? 'פעיל' : box.status === 'MAINTENANCE' ? 'בתחזוקה' : 'לא פעיל'} 
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
                      onClick={() => handleEditBox(box)}
                    >
                      ערוך
                    </Button>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteBox(box.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                לא נמצאו ארגזים מתאימים לחיפוש
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* Add/Edit Box Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentBox ? `עריכת ארגז: ${currentBox.locationName}` : 'הוספת ארגז חדש'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="locationName"
            label="שם מיקום"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.locationName}
            onChange={handleInputChange}
            required
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            name="address"
            label="כתובת"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.address}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>סטטוס</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="סטטוס"
              onChange={handleInputChange}
            >
              <MenuItem value="ACTIVE">פעיל</MenuItem>
              <MenuItem value="MAINTENANCE">בתחזוקה</MenuItem>
              <MenuItem value="INACTIVE">לא פעיל</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ביטול</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!formData.locationName}
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

export default BoxesPage;
