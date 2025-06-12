import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Typography, 
  Box 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Button from './Button';

/**
 * Custom modal component with consistent styling
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {Array} props.actions - Array of action objects { label, onClick, color, variant, loading }
 * @param {boolean} props.fullWidth - Whether the modal should take up the full width
 * @param {string} props.maxWidth - Maximum width of the modal ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {boolean} props.disableBackdropClick - Whether to disable closing the modal when clicking the backdrop
 * @param {boolean} props.disableEscapeKeyDown - Whether to disable closing the modal when pressing escape
 */
function Modal({ 
  open, 
  onClose, 
  title, 
  children, 
  actions = [], 
  fullWidth = true, 
  maxWidth = 'sm',
  disableBackdropClick = false,
  disableEscapeKeyDown = false
}) {
  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (disableBackdropClick && event.target === event.currentTarget) {
      event.stopPropagation();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onBackdropClick={handleBackdropClick}
      disableEscapeKeyDown={disableEscapeKeyDown}
    >
      {/* Modal title */}
      {title && (
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
      )}
      
      {/* Modal content */}
      <DialogContent dividers>
        {children}
      </DialogContent>
      
      {/* Modal actions */}
      {actions.length > 0 && (
        <DialogActions>
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              color={action.color || 'primary'}
              variant={action.variant || 'text'}
              loading={action.loading}
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
}

export default Modal;
