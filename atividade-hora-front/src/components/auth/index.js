// Criar um novo arquivo, por exemplo, AuthContext.js

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLogado, setIsLogado] = useState(false); // Defina o estado de login inicial aqui

  return (
    <AuthContext.Provider value={{ isLogado, setIsLogado }}>
      {children}
    </AuthContext.Provider>
  );
}
