import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1976d2',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
      }}
    >
      <Typography variant="body1" component="span" sx={{ marginRight: '0.5rem' }}>
        © {new Date().getFullYear()} Seu Nome ou Empresa
      </Typography>
      <Typography variant="body1" component="span">
        Desenvolvido por Carlos Oliveira
      </Typography>
    </Box>
  );
};

export default Footer;
