    import React, { createContext, useState, useEffect } from 'react';

    export const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const savedUser = localStorage.getItem("ecoWatts_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        setLoading(false);
      }, []);

      const login = (userData) => {
        const userWithStatus = { ...userData, isLogged: true };
        setUser(userWithStatus);
        localStorage.setItem("ecoWatts_user", JSON.stringify(userWithStatus));
      };

      const logout = () => {
        setUser(null);
        localStorage.removeItem("ecoWatts_user");
      };

      // Atualiza nome, email ou foto no estado e no localStorage
      const updateUser = (newData) => {
        setUser((prev) => {
          const updated = { ...prev, ...newData };
          localStorage.setItem("ecoWatts_user", JSON.stringify(updated));
          return updated;
        });
      };

      return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
          {!loading && children} 
        </AuthContext.Provider>
      );
    };