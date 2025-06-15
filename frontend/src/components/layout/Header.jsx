import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Header({ toggleSidebar }) {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Box
          component="img"
          sx={{ height: 40, mr: 2 }}
          alt="Kesher Logo"
          src="/logo.png" // You should add your logo to the public folder
        />
        <Typography variant="h6" noWrap component="div">
          קשר מנג'ר
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
