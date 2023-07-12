import { useLocation } from 'react-router-dom';
import './styles.css';
import { db } from '../google-sign-in/config';
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const location = useLocation();
  let userName = location.state.userName.split(' ')[0];
  let userPhoto = location.state.userPhoto;
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const addUser = async () => {
    try {
      if (nameInput.length < 3) {
        toast.error('O nome deve ter no mínimo 3 caracteres');
        return;
      }

      if (!validateEmail(emailInput)) {
        toast.error('O email informado é inválido');
        return;
      }

      const existingUser = users.find((user) => user.email === emailInput);
      if (existingUser) {
        toast.error('Já existe um usuário cadastrado com esse email');
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
      toast.error('Ocorreu um erro ao adicionar o usuário');
    }
  };

  const deleteUser = async () => {
    try {
      if (selectedUser && selectedUser.id) {
        await deleteDoc(doc(db, 'users', selectedUser.id));
        console.log('Document deleted with ID: ', selectedUser.id);
        setDataChanged(true);
      }
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast.error('Ocorreu um erro ao excluir o usuário');
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
        toast.error('Ocorreu um erro ao buscar os usuários');
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

  return (
    <>
      <div className='home-container'>
        {userName}<br />
        <img src={userPhoto} width={50} height={50} />
      </div>
      <div>
        <input
          type='text'
          value={nameInput}
          placeholder='Nome'
          onChange={(e) => setNameInput(e.target.value)}
        />
        <input
          type='email'
          value={emailInput}
          placeholder='Email'
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <button onClick={addUser}>Add user</button>
      </div>
      <div>
        {users.map((user) => (
          <div id={user.id} key={user.id}>
            {user.name}
            <button onClick={() => {
              setSelectedUser(user);
              setIsModalOpen(true);
            }}>Excluir</button>
          </div>
        ))}
      </div>
      {isModalOpen && selectedUser && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Tem certeza que deseja excluir o usuário?</h2>
            <p>Nome: {selectedUser.name}</p>
            <p>Email: {selectedUser.email}</p>
            <div className='modal-buttons'>
              <button onClick={deleteUser}>Confirmar</button>
              <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-center" />
    </>
  )
}

export default Home;
