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
 * Form component for creating or editing a task
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when dialog is closed
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Object} props.formData - Current form data values
 * @param {Function} props.onChange - Function to call when form fields change
 * @param {Object|null} props.currentTask - The task being edited, or null if creating a new task
 * @param {Array} props.boxes - Array of boxes for the related box dropdown
 * @param {boolean} props.boxesLoading - Whether the boxes are currently loading
 */
function TaskForm({ 
  open, 
  onClose, 
  onSubmit, 
  formData, 
  onChange, 
  currentTask, 
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
        {currentTask ? `עריכת משימה: ${currentTask.description}` : 'הוספת משימה חדשה'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>סוג משימה</InputLabel>
              <Select
                name="taskType"
                value={formData.taskType}
                label="סוג משימה"
                onChange={handleInputChange}
              >
                <MenuItem value="COLLECTION">איסוף</MenuItem>
                <MenuItem value="TRANSPORT">שינוע</MenuItem>
                <MenuItem value="MAINTENANCE">תחזוקה</MenuItem>
                <MenuItem value="OTHER">אחר</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>ארגז קשור</InputLabel>
              <Select
                name="relatedBoxId"
                value={formData.relatedBoxId}
                label="ארגז קשור"
                onChange={handleInputChange}
                disabled={boxesLoading}
              >
                <MenuItem value="">ללא</MenuItem>
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
            <TextField
              name="assignedTo"
              label="משויך ל"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.assignedTo}
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
          disabled={!formData.description}
        >
          שמור
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskForm;
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>עדיפות</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                label="עדיפות"
                onChange={handleInputChange}
              >
                <MenuItem value="LOW">נמוכה</MenuItem>
                <MenuItem value="MEDIUM">בינונית</MenuItem>
                <MenuItem value="HIGH">גבוהה</MenuItem>
                <MenuItem value="URGENT">דחוף</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="description"
              label="תיאור"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="dueDate"
              label="תאריך יעד"
              type="date"
              fullWidth
              variant="outlined"
              value={formData.dueDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
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
                <MenuItem value="PENDING">ממתינה</MenuItem>
                <MenuItem value="IN_PROGRESS">בביצוע</MenuItem>
                <MenuItem value="COMPLETED">הושלמה</MenuItem>
                <MenuItem value="CANCELLED">בוטלה</MenuItem>