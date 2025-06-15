import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

/**
 * Form component for creating or editing a box
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when dialog is closed
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Object} props.formData - Current form data values
 * @param {Function} props.onChange - Function to call when form fields change
 * @param {Object|null} props.currentBox - The box being edited, or null if creating a new box
 */
function BoxForm({ open, onClose, onSubmit, formData, onChange, currentBox }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {currentBox ? `עריכת ארגז: ${currentBox.donationGroup}` : 'הוספת ארגז חדש'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="donationGroup"
          label="שם מיקום"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.donationGroup}
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
        <Button onClick={onClose}>ביטול</Button>
        <Button 
          onClick={onSubmit} 
          variant="contained" 
          color="primary"
          disabled={!formData.donationGroup}
        >
          שמור
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BoxForm;
