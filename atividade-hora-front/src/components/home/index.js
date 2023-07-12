// Home.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import {
    Button,
    TextField,
    createTheme,
    ThemeProvider,
    Snackbar,
    Alert,
    Paper
} from '@mui/material';
import { db } from '../google-sign-in/config';
import UserList from '../user/list';
import UserModal from '../user/modal';
import './styles.css'

function Home() {
  const location = useLocation();
  let userName = location.state.userName.split(' ')[0];
  let userPhoto = location.state.userPhoto;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dataChanged, setDataChanged] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const handleDeleteUser = async (user) => {
    try {
      if (user && user.id) {
        await deleteDoc(doc(db, 'users', user.id));
        console.log('Document deleted with ID: ', user.id);
        setDataChanged(true);
      }
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting document: ', error);
      setSnackbarMessage('Ocorreu um erro ao excluir o usuário');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users: ', error);
        setSnackbarMessage('Ocorreu um erro ao buscar os usuários');
        setSnackbarOpen(true);
      }
    };

    fetchUsers();
    setDataChanged(false); // Reset dataChanged state after fetching users
  }, [dataChanged]);

  const validateEmail = (email) => {
    // Simple email validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Cria um tema personalizado para o TextField
  const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputLabel-root': {
                        color: 'white',
                    },
                    '& .MuiInputLabel-outlined.Mui-focused': {
                        color: 'white',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white',
                        },
                        '&:hover fieldset': {
                            borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white',
                        },
                        '& input::placeholder': {
                            color: 'white',
                        },
                    },
                    input: {
                        color: 'white'
                    }
                },
            },
        },
    },
});

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const addUser = async () => {
    try {
      if (nameInput.length < 3) {
        setSnackbarMessage('O nome deve ter no mínimo 3 caracteres');
        setSnackbarOpen(true);
        return;
      }

      if (!validateEmail(emailInput)) {
        setSnackbarMessage('O email informado é inválido');
        setSnackbarOpen(true);
        return;
      }

      const existingUser = users.find((user) => user.email === emailInput);
      if (existingUser) {
        setSnackbarMessage('Já existe um usuário cadastrado com esse email');
        setSnackbarOpen(true);
        return;
      }

      const docRef = await addDoc(collection(db, 'users'), {
        name: nameInput,
        email: emailInput,
      });
      console.log('Document written with ID: ', docRef.id);
      setNameInput('');
      setEmailInput('');
      setDataChanged(true);
    } catch (error) {
      console.error('Error adding document: ', error);
      setSnackbarMessage('Ocorreu um erro ao adicionar o usuário');
      setSnackbarOpen(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <div className='home-container'>
          <Paper elevation={24} className='user-container'>
            {userName}<br />
            <img src={userPhoto} width={50} height={50} />
          </Paper>
        </div>
        <div>
          <TextField
            type='text'
            value={nameInput}
            label='Nome'
            variant='outlined'
            onChange={(e) => setNameInput(e.target.value)}
          />
          <TextField
            type='email'
            value={emailInput}
            label='Email'
            variant='outlined'
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <Button variant='contained' onClick={addUser}>
            Add User
          </Button>
        </div>
        <UserList users={users} onDeleteUser={handleOpenModal} />
        <UserModal
          user={selectedUser}
          open={isModalOpen}
          onClose={handleCloseModal}
          onDelete={() => handleDeleteUser(selectedUser)}
        />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity='error' onClose={handleSnackbarClose}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default Home;
