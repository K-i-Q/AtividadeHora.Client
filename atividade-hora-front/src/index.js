import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './screens/home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Error from './components/error';
import { AuthProvider } from './components/auth';
import Perfil from './screens/perfil';
import Login from './screens/login';


const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'perfil',
        element: <Perfil />
      }
    ]
  }
])

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
