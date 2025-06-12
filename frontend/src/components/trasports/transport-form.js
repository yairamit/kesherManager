import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress 
} from '@mui/material';

/**
 * Form component for creating or editing a transport
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when dialog is closed
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Object} props.formData - Current form data values
 * @param {Function} props.onChange - Function to call when form fields change
 * @param {Object|null} props.currentTransport - The transport being edited, or null if creating a new transport
 * @param {Array} props.boxes - Array of boxes for the source/destination box dropdowns
 * @param {boolean} props.boxesLoading - Whether the boxes are currently loading
 */
function TransportForm({ 
  open, 
  onClose, 
  onSubmit, 
  formData, 
  onChange, 
  currentTransport, 
  boxes = [], 
  boxesLoading = false 
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                {boxesLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  boxes.map(box => (
                    <MenuItem key={box.id} value={box.id}>
                      {box.locationName}
                    </MenuItem>
                  ))
                )}
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
                  {boxesLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    boxes
                      .filter(box => box.id !== formData.sourceBoxId) // Exclude source box
                      .map(box => (
                        <MenuItem key={box.id} value={box.id}>
                          {box.locationName}
                        </MenuItem>
                      ))
                  )}
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
        <Button onClick={onClose}>ביטול</Button>
        <Button 
          onClick={onSubmit} 
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
  );
}

export default TransportForm;
