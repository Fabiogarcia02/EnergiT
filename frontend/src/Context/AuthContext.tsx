    import { createContext, useState, useEffect, ReactNode } from 'react';

    // Definindo o que tem dentro do usuário
    interface User {
      name: string;
      email: string;
      avatarUrl?: string | null;
      isLogged?: boolean;
    }

    // Definindo o que o Contexto oferece para os outros componentes
    interface AuthContextType {
      user: User | null;
      login: (userData: User) => void;
      logout: () => void;
      updateUser: (newData: Partial<User>) => void;
      loading: boolean;
    }

    export const AuthContext = createContext<AuthContextType | undefined>(undefined);

    export const AuthProvider = ({ children }: { children: ReactNode }) => {
      const [user, setUser] = useState<User | null>(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const savedUser = localStorage.getItem("ecoWatts_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        setLoading(false);
      }, []);

      const login = (userData: User) => {
        const userWithStatus = { ...userData, isLogged: true };
        setUser(userWithStatus);
        localStorage.setItem("ecoWatts_user", JSON.stringify(userWithStatus));
      };

      const logout = () => {
        setUser(null);
        localStorage.removeItem("ecoWatts_user");
      };

      const updateUser = (newData: Partial<User>) => {
        setUser((prev) => {
          if (!prev) return null;
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