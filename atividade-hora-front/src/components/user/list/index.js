// UserList.js
import React from 'react';
import UserCard from '../card';

function UserList({ users, onDeleteUser }) {
  return (
    <div>
      {users.map((user) => (
        <UserCard user={user} onDelete={onDeleteUser} />
      ))}
    </div>
  );
}

export default UserList;
