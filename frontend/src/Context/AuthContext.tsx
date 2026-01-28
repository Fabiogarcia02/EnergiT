import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica se existe um usuário salvo no navegador ao carregar o app
  useEffect(() => {
    const savedUser = localStorage.getItem("ecoWatts_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Função para fazer Login
  const login = (userData) => {
    const userWithStatus = { ...userData, isLogged: true };
    setUser(userWithStatus);
    localStorage.setItem("ecoWatts_user", JSON.stringify(userWithStatus));
  };

  // Função para fazer Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecoWatts_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};