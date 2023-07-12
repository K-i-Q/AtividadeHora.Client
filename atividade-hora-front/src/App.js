import './App.css';
import SignIn from './components/google-sign-in/index';
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Outlet />
      </header>
    </div>
  );
}

export default App;
