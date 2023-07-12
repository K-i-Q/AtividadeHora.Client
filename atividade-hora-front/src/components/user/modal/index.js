// UserModal.js
import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

function UserModal({ user, open, onClose, onDelete }) {
  const handleDelete = () => {
    onDelete(user);
    onClose(); // Fechar a modal após a exclusão
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 2,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          Tem certeza que deseja excluir o usuário?
        </Typography>
        <Typography id="modal-description">
          Nome: {user?.name}
        </Typography>
        <Typography id="modal-description">
          Email: {user?.email}
        </Typography>
        <div className='modal-buttons'>
          <Button onClick={handleDelete} color='error' variant="contained">
            Delete
          </Button>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default UserModal;
