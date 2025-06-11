import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Grid,
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
  Chip,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import transportService from '../services/transportService';
import boxService from '../services/boxService';
import { formatDate } from '../utils/dateUtils';

function TransportsPage() {
  const [transports, setTransports] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boxesLoading, setBoxesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTransport, setCurrentTransport] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Initial form state
  const initialFormState = {
    sourceBoxId: '',
    destinationType: 'BOX',
    destinationBoxId: '',
    destinationName: '',
    quantity: '',
    scheduledDate: '',
    status: 'PLANNED',
    notes: '',
    createdBy: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // Load transports and boxes on component mount
  useEffect(() => {
    fetchTransports();
    fetchBoxes();
  }, []);

  // Fetch transports from the API
  const fetchTransports = async () => {
    try {
      setLoading(true);
      const data = await transportService.getAllTransports();
      setTransports(data);
    } catch (error) {
      console.error('Error fetching transports:', error);
      showSnackbar('שגיאה בטעינת שינועים', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch boxes for the dropdown
  const fetchBoxes = async () => {
    try {
      setBoxesLoading(true);
      const data = await boxService.getAllBoxes();
      setBoxes(data.filter(box => box.status === 'ACTIVE')); // Only show active boxes
    } catch (error) {
      console.error('Error fetching boxes:', error);
    } finally {
      setBoxesLoading(false);
    }
  };

  // Filter transports based on tab and search term
  const filteredTransports = transports.filter(transport => {
    const matchesSearch = 
      (transport.sourceBox && transport.sourceBox.locationName.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (transport.destinationBox && transport.destinationBox.locationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transport.destinationName && transport.destinationName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by status based on selected tab
    if (tabValue === 0) return matchesSearch; // All transports
    if (tabValue === 1) return matchesSearch && transport.status === 'PLANNED';
    if (tabValue === 2) return matchesSearch && transport.status === 'IN_PROGRESS';
    if (tabValue === 3) return matchesSearch && transport.status === 'COMPLETED';
    
    return matchesSearch;
  });

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If user changes destination type, reset destination box ID and name
    if (name === 'destinationType') {
      setFormData(prev => ({
        ...prev,
        destinationBoxId: '',
        destinationName: ''
      }));
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open dialog for adding a new transport
  const handleAddTransport = () => {
    setCurrentTransport(null);
    setFormData(initialFormState);
    setOpenDialog(true);
  };

  // Open dialog for editing an existing transport
  const handleEditTransport = (transport) => {
    setCurrentTransport(transport);
    setFormData({
      sourceBoxId: transport.sourceBox ? transport.sourceBox.id : '',
      destinationType: transport.destinationType,
      destinationBoxId: transport.destinationBox ? transport.destinationBox.id : '',
      destinationName: transport.destinationName || '',
      quantity: transport.quantity || '',
      scheduledDate: transport.scheduledDate ? new Date(transport.scheduledDate).toISOString().split('T')[0] : '',
      status: transport.status,
      notes: transport.notes || '',
      createdBy: transport.createdBy || ''
    });
    setOpenDialog(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Prepare data for API
      const transportData = {
        sourceBox: { id: formData.sourceBoxId },
        destinationType: formData.destinationType,
        destinationBox: formData.destinationType === 'BOX' && formData.destinationBoxId ? 
          { id: formData.destinationBoxId } : null,
        destinationName: formData.destinationType !== 'BOX' ? formData.destinationName : null,
        quantity: formData.quantity,
        scheduledDate: formData.scheduledDate,
        status: formData.status,
        notes: formData.notes,
        createdBy: formData.createdBy
      };

      if (currentTransport) {
        // Update existing transport
        await transportService.updateTransport(currentTransport.id, transportData);
        showSnackbar('השינוע עודכן בהצלחה');
      } else {
        // Create new transport
        await transportService.createTransport(transportData);
        showSnackbar('השינוע נוצר בהצלחה');
      }
      setOpenDialog(false);
      fetchTransports(); // Refresh the list
    } catch (error) {
      console.error('Error saving transport:', error);
      showSnackbar('שגיאה בשמירת השינוע', 'error');
    }
  };

  // Handle transport deletion
  const handleDeleteTransport = async (transportId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק שינוע זה?')) {
      try {
        await transportService.deleteTransport(transportId);
        showSnackbar('השינוע נמחק בהצלחה');
        fetchTransports(); // Refresh the list
      } catch (error) {
        console.error('Error deleting transport:', error);
        showSnackbar('שגיאה במחיקת השינוע', 'error');
      }
    }
  };

  // Complete a transport
  const handleCompleteTransport = async (transportId) => {
    try {
      await transportService.completeTransport(transportId, { completionDate: new Date() });
      showSnackbar('השינוע הושלם בהצלחה');
      fetchTransports(); // Refresh the list
    } catch (error) {
      console.error('Error completing transport:', error);
      showSnackbar('שגיאה בהשלמת השינוע', 'error');
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

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          ניהול שינועים
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          startIcon={<AddIcon />}
          onClick={handleAddTransport}
        >
          הוסף שינוע חדש
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
          <Tab label="כל השינועים" />
          <Tab label="מתוכננים" />
          <Tab label="בביצוע" />
          <Tab label="הושלמו" />
        </Tabs>
      </Box>

      <TextField
        fullWidth
        margin="normal"
        placeholder="חיפוש לפי מקור, יעד או שם יעד..."
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
              {filteredTransports.length > 0 ? (
                filteredTransports.map((transport) => (
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
                        label={transport.status === 'PLANNED' ? 'מתוכנן' : transport.status === 'IN_PROGRESS' ? 'בביצוע' : transport.status === 'COMPLETED' ? 'הושלם' : 'בוטל'} 
                        color={getStatusColor(transport.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{transport.completionDate ? formatDate(transport.completionDate) : '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <IconButton 
                          size="small"
                          onClick={() => handleEditTransport(transport)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDeleteTransport(transport.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        {transport.status !== 'COMPLETED' && (
                          <Tooltip title="סמן כהושלם">
                            <IconButton 
                              color="success" 
                              size="small"
                              onClick={() => handleCompleteTransport(transport.id)}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    לא נמצאו שינועים מתאימים לחיפוש
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Transport Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentTransport ? 'עריכת שינוע' : 'הוספת שינוע חדש'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>ארגז מקור</InputLabel>
                <Select
                  name="sourceBoxId"
                  value={formData.sourceBoxId}
                  label="ארגז מקור"
                  onChange={handleInputChange}
                  disabled={boxesLoading}
                >
                  {boxes.map(box => (
                    <MenuItem key={box.id} value={box.id}>
                      {box.locationName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>סוג יעד</InputLabel>
                <Select
                  name="destinationType"
                  value={formData.destinationType}
                  label="סוג יעד"
                  onChange={handleInputChange}
                >
                  <MenuItem value="BOX">ארגז</MenuItem>
                  <MenuItem value="STORE">חנות</MenuItem>
                  <MenuItem value="FAMILY">משפחה</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.destinationType === 'BOX' ? (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>ארגז יעד</InputLabel>
                  <Select
                    name="destinationBoxId"
                    value={formData.destinationBoxId}
                    label="ארגז יעד"
                    onChange={handleInputChange}
                    disabled={boxesLoading}
                  >
                    {boxes
                      .filter(box => box.id !== formData.sourceBoxId) // Exclude source box
                      .map(box => (
                        <MenuItem key={box.id} value={box.id}>
                          {box.locationName}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              <Grid item xs={12} sm={6}>
                <TextField
                  name="destinationName"
                  label={formData.destinationType === 'STORE' ? 'שם החנות' : 'שם המשפחה'}
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.destinationName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                name="quantity"
                label="כמות/תיאור מזון"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="scheduledDate"
                label="תאריך מתוכנן"
                type="date"
                fullWidth
                variant="outlined"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
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
                  <MenuItem value="PLANNED">מתוכנן</MenuItem>
                  <MenuItem value="IN_PROGRESS">בביצוע</MenuItem>
                  <MenuItem value="COMPLETED">הושלם</MenuItem>
                  <MenuItem value="CANCELLED">בוטל</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="createdBy"
                label="נוצר על ידי"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.createdBy}
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
            disabled={!formData.sourceBoxId || 
              (formData.destinationType === 'BOX' && !formData.destinationBoxId) || 
              (formData.destinationType !== 'BOX' && !formData.destinationName) ||
              !formData.scheduledDate}
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

export default TransportsPage;
