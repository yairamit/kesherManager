import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

/**
 * Custom button component with loading state
 * 
 * @param {Object} props
 * @param {boolean} props.loading - Whether the button is in a loading state
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Function to call when button is clicked
 * @param {Object} props.buttonProps - Additional props to pass to the MUI Button component
 */
function Button({ loading = false, children, onClick, ...buttonProps }) {
  return (
    <MuiButton
      onClick={loading ? undefined : onClick}
      disabled={loading || buttonProps.disabled}
      {...buttonProps}
    >
      {loading ? (
        <>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          {children}
        </>
      ) : (
        children
      )}
    </MuiButton>
  );
}

export default Button;
