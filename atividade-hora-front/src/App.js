import './App.css';
import SignIn from './components/google-sign-in/index';
import { Outlet } from 'react-router-dom';
import ResponsiveAppBar from './components/appbar';
import { useState, useEffect } from 'react';
import { auth, provider } from './components/google-sign-in/config'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';


function App() {
  const [isLogado, setIsLogado] = useState(false);
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    setEmail(localStorage.getItem('email'))
  }, []);


  const login = async () => {
    try {
      const data = await signInWithPopup(auth, provider);

      setEmail(data.user.email);
      setPhotoUrl(data.user.photoURL)
      setName(data.user.displayName)
      localStorage.setItem('email', data.user.email);
      navigate('/home', {
        state: {
          userName: data.user.displayName,
          userPhoto: data.user.photoURL
        }
      })
      setIsLogado(true);
    } catch (error) {
      //exibe uma mensagem de falha no login
      setIsLogado(false);
    }
  }

  return (
    <div className="App">
      <ResponsiveAppBar isLogado={isLogado} handleLoginClick={login} />
      <header className="App-header">
        <Outlet />
        <p>footer</p>
      </header>
    </div>
  );
}

export default App;
