// UserCard.js
import React from 'react';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function UserCard({ user, onDelete }) {
  return (
    <div id={user.id} key={user.id}>
      {user.name}
      <Button variant='contained' color='error' onClick={() => onDelete(user)}>
        <DeleteIcon />
      </Button>
    </div>
  );
}

export default UserCard;
