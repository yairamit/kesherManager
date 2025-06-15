import React from 'react';
import { 
  Card as MuiCard, 
  CardContent, 
  CardActions, 
  CardHeader,
  Typography,
  Box,
  Divider
} from '@mui/material';

/**
 * Custom card component with consistent styling
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.title - Card title
 * @param {React.ReactNode} props.subtitle - Card subtitle
 * @param {React.ReactNode} props.icon - Icon to display in the header
 * @param {React.ReactNode} props.headerAction - Action to display in the header
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.actions - Card actions
 * @param {Object} props.sx - Additional styles to apply to the card
 * @param {boolean} props.noPadding - Whether to remove padding from the card content
 * @param {Object} props.cardProps - Additional props to pass to the MUI Card component
 */
function Card({ 
  title, 
  subtitle, 
  icon, 
  headerAction, 
  children, 
  actions, 
  sx = {}, 
  noPadding = false,
  cardProps = {}
}) {
  return (
    <MuiCard 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        ...sx 
      }}
      {...cardProps}
    >
      {/* Card header */}
      {(title || icon) && (
        <>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
                {typeof title === 'string' ? (
                  <Typography variant="h6" component="h2">
                    {title}
                  </Typography>
                ) : (
                  title
                )}
              </Box>
            }
            subheader={subtitle}
            action={headerAction}
            sx={{
              '.MuiCardHeader-action': {
                margin: 0,
                alignSelf: 'center',
              },
            }}
          />
          <Divider />
        </>
      )}
      
      {/* Card content */}
      <CardContent 
        sx={{ 
          flexGrow: 1,
          ...(noPadding && { p: 0, '&:last-child': { pb: 0 } })
        }}
      >
        {children}
      </CardContent>
      
      {/* Card actions */}
      {actions && (
        <>
          <Divider />
          <CardActions>
            {actions}
          </CardActions>
        </>
      )}
    </MuiCard>
  );
}

export default Card;
      