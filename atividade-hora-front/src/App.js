import './App.css';
import { Outlet } from 'react-router-dom';
import ResponsiveAppBar from './components/appbar';
import { useState, useEffect } from 'react';
import { auth, provider } from './components/google-sign-in/config'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import Footer from './components/footer';
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import checkCollection from './repository';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { useAuth } from './components/auth';

function App() {
  const navigate = useNavigate();
  const usuariosRef = collection(getFirestore(), 'usuarios');
  const [openModalEmail, setOpenModalEmail] = useState(false);
  const [openModalSenha, setOpenModalSenha] = useState(false);
  const [openModalCadastro, setOpenModalCadastro] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [usuarioSnapShot, setUsuarioSnapShot] = useState();

  useEffect(() => {
    checkCollection(usuariosRef);
  }, [])
  const { isLogado, setIsLogado } = useAuth();
  const loginGoogle = async () => {
    try {
      const data = await signInWithPopup(auth, provider);
      localStorage.setItem('email', data.user.email);
      navigate('/home', {
        state: {
          userName: data.user.displayName,
          userPhoto: data.user.photoURL,
          userEmail: data.user.email
        }
      })
      setIsLogado(true);
    } catch (error) {
      //exibe uma mensagem de falha no login
      setIsLogado(false);
    }
  }

  const getUsuario = async (email) => {
    const consulta = query(usuariosRef, where('email', '==', email));
    const snapShot = await getDocs(consulta);
    if (!snapShot.empty) {
      handleCloseModalEmail();
      handleOpenModalSenha();
      setUsuarioSnapShot(snapShot);
    } else {
      //abre modal de cadastro
      handleOpenModalCadastro();
    }
  }

  const insertUsuario = () => {
    const dadosUsuario = {
      nome: nome,
      email: email,
      senha: senha,
      data_cadastro: new Date(),
    };
    // Salvar a atividade no Firebase
    addDoc(usuariosRef, dadosUsuario)
      .catch((error) => {
        console.error('Erro ao salvar usuário:', error);
      });
  }

  const usuarioComCadastro = async () => {
    return !usuarioSnapShot.empty;
  }

  const loginEmailSenha = async () => {
    try {
      if (usuarioComCadastro()) {
        usuarioSnapShot.docs.map((doc) => {
          const user = doc.data();
          if (user.senha !== senha) {
            console.error('Erro senha incorreta');
          }
          else {
            guardarEmailNavegarHome();
          }
        })

      } else {
        insertUsuario();
      }
      guardarEmailNavegarHome();
    } catch (error) {
      //exibe uma mensagem de falha no login
      setIsLogado(false);
    }
  }

  const guardarEmailNavegarHome = () => {
    localStorage.setItem('email', email);
    setIsLogado(true);
    navigate('/home', {
      state: {
        userName: nome,
        userPhoto: '',
        userEmail: email
      }
    })
  }

  const login = async (isGoogle) => {

    if (isGoogle) {
      loginGoogle();
    } else {
      loginEmailSenha();
      handleCloseModalSenha();
    }
  }


  const handleOpenModalEmail = () => {
    setOpenModalEmail(true);
  };
  const handleCloseModalEmail = () => {
    setOpenModalEmail(false);
  };

  const handleOpenModalSenha = () => {
    setOpenModalSenha(true);
  };
  const handleCloseModalSenha = () => {
    setOpenModalSenha(false);
  };

  const handleOpenModalCadastro = () => {
    setOpenModalCadastro(true);
  };
  const handleCloseModalCadastro = () => {
    setOpenModalCadastro(false);
  };

  const handleCadastrarUsuario = () => {
    insertUsuario();
    handleCloseModalCadastro();
    handleCloseModalEmail();
    guardarEmailNavegarHome();
  };

 


  return (
    <>
      <div className="App">
        <ResponsiveAppBar setIsLogado={setIsLogado} handleOpenModalEmail={handleOpenModalEmail} isLogado={isLogado} handleLoginClick={login} />
        <header className="App-header">
          <Outlet isLogado={isLogado} />
          <Footer />
        </header>
      </div>
      <Modal
        open={openModalEmail}
        onClose={handleCloseModalEmail}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* Conteúdo do modal */}
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Digite seu email<br />
            <TextField value={email} onChange={(e) => setEmail(e.target.value)} id="input-email" label="Email: " variant="outlined" />
          </Typography>
          <Button onClick={() => getUsuario(email)}>Próximo</Button>
          <Button onClick={handleCloseModalEmail}>Cancelar</Button>
        </Box>
      </Modal>
      <Modal
        open={openModalSenha}
        onClose={handleCloseModalSenha}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* Conteúdo do modal */}
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Digite sua senha<br />
            <TextField value={senha} onChange={(e) => setSenha(e.target.value)} id="input-senha" label="Senha: " variant="outlined" type='password' />
          </Typography>
          <Button onClick={() => login(false)}>Confirmar</Button>
          <Button onClick={handleCloseModalSenha}>Cancelar</Button>
        </Box>
      </Modal>
      <Modal
        open={openModalCadastro}
        onClose={handleCloseModalCadastro}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* Conteúdo do modal */}
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Cadastro<br />
            <TextField value={nome} onChange={(e) => setNome(e.target.value)} id="input-nome" label="Nome: " variant="outlined" />
            <TextField value={email} onChange={(e) => setEmail(e.target.value)} id="input-email" label="Email: " variant="outlined" />
            <TextField value={senha} onChange={(e) => setSenha(e.target.value)} id="input-senha" label="Senha: " variant="outlined" type='password' />
          </Typography>
          <Button onClick={handleCadastrarUsuario}>Cadastrar</Button>
          <Button onClick={handleCloseModalCadastro}>Cancelar</Button>
        </Box>
      </Modal>
    </>
  );

}

export default App;
