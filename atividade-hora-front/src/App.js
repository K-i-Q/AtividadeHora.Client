import './App.css';
import SignIn from './components/google-sign-in/index';
import { Outlet } from 'react-router-dom';
import ResponsiveAppBar from './components/appbar';

function App() {
  
  const handleLoginClick = () => {
    console.log('Clicou no botão de login');
  };

  return (
    <div className="App">
      <ResponsiveAppBar handleLoginClick={handleLoginClick} />
      <header className="App-header">
        <Outlet />
        <p>footer</p>
      </header>
    </div>
  );
}

export default App;
