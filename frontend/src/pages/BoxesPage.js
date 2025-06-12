import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
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
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const initialFormState = { responsiblePerson: '', donationGroup: '', address: '', status: 'ACTIVE', notes: '' };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchBoxes();
  }, []);

  const fetchBoxes = async () => {
    try {
      setLoading(true);
      const data = await boxService.getAllBoxes();
      const fixed = data.map(box => ({ ...box, donationGroup: box.donationGroup ?? '' }));
      setBoxes(fixed);
    } catch (error) {
      console.error('Error fetching boxes:', error);
      showSnackbar('שגיאה בטעינת ארגזים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredBoxes = boxes.filter(box =>
    box.donationGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (box.address && box.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBox = () => {
    setCurrentBox(null);
    setFormData(initialFormState);
    setOpenDialog(true);
  };

  const handleEditBox = box => {
    setCurrentBox(box);
    setFormData({
      responsiblePerson: box.responsiblePerson,
      donationGroup: box.donationGroup,
      address: box.address || '',
      status: box.status,
      notes: box.notes || ''
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (currentBox) {
        await boxService.updateBox(currentBox.id, formData);
        showSnackbar('הארגז עודכן בהצלחה');
      } else {
        await boxService.createBox(formData);
        showSnackbar('הארגז נוצר בהצלחה');
      }
      setOpenDialog(false);
      fetchBoxes();
    } catch (error) {
      console.error('Error saving box:', error);
      showSnackbar('שגיאה בשמירת הארגז', 'error');
    }
  };

  const handleDeleteBox = async boxId => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק ארגז זה?')) {
      try {
        await boxService.deleteBox(boxId);
        showSnackbar('הארגז נמחק בהצלחה');
        fetchBoxes();
      } catch (error) {
        console.error('Error deleting box:', error);
        showSnackbar('שגיאה במחיקת הארגז', 'error');
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getStatusColor = status => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'MAINTENANCE': return 'warning';
      case 'INACTIVE': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">ניהול ארגזים</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleAddBox}>
          הוסף ארגז חדש
        </Button>
      </Box>

      <TextField
        fullWidth
        margin="normal"
        placeholder="חיפוש לפי קבוצה או כתובת..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                 <TableCell>אחראי ארגז</TableCell>
                <TableCell>מעגל נתינה</TableCell>
                <TableCell>כתובת</TableCell>
                <TableCell>סטטוס</TableCell>
                <TableCell>עודכן בתאריך</TableCell>
                <TableCell align="center">פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBoxes.map(box => (
                <TableRow key={box.id} sx={{ bgcolor: box.status === 'INACTIVE' ? 'rgba(0,0,0,0.05)' : 'inherit' }}>   
                  <TableCell>{box.responsiblePerson}</TableCell>
                  <TableCell>{box.donationGroup}</TableCell>
                  <TableCell>{box.address}</TableCell>

                  <TableCell>
                    <Chip
                      label={box.status === 'ACTIVE' ? 'פעיל' : box.status === 'MAINTENANCE' ? 'בתחזוקה' : 'לא פעיל'}
                      color={getStatusColor(box.status)} size="small"/>
                  </TableCell>
                  <TableCell>{formatDate(box.updatedAt)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEditBox(box)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteBox(box.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Box Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentBox ? `עריכת ארגז: ${currentBox.donationGroup}` : 'הוספת ארגז חדש'}</DialogTitle>
        <DialogContent>
           <TextField autoFocus margin="dense" name="responsiblePerson" label="אחראי ארגז" type="text" fullWidth variant="outlined" value={formData.responsiblePerson} onChange={handleInputChange} required sx={{ mb: 2, mt: 1 }} />
           <TextField autoFocus margin="dense" name="donationGroup" label="שם מיקום" type="text" fullWidth variant="outlined" value={formData.donationGroup} onChange={handleInputChange} required sx={{ mb: 2, mt: 1 }} />
          <TextField margin="dense" name="address" label="כתובת" type="text" fullWidth variant="outlined" value={formData.address} onChange={handleInputChange} sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>סטטוס</InputLabel>
            <Select name="status" value={formData.status} label="סטטוס" onChange={handleInputChange}>
              <MenuItem value="ACTIVE">פעיל</MenuItem>
              <MenuItem value="MAINTENANCE">בתחזוקה</MenuItem>
              <MenuItem value="INACTIVE">לא פעיל</MenuItem>
            </Select>
          </FormControl>
          <TextField margin="dense" name="notes" label="הערות" type="text" fullWidth variant="outlined" multiline rows={3} value={formData.notes} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ביטול</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!formData.donationGroup}>שמור</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default BoxesPage;
