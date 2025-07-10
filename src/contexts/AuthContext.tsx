import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { authService } from "../services/authService";
import { devLogin } from "../utils/devLogin";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const { user } = await authService.getCurrentUser();
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          // Durante desenvolvimento, tentar login automático
          if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_DEV_LOGIN === 'true') {
            try {
              const result = await devLogin();
              setUser(result.user);
              localStorage.setItem("user", JSON.stringify(result.user));
            } catch (devError) {
              // Silenciar erro de dev login
            }
          }
        }
      } catch (error) {
        console.error("AuthContext: Error getting current user:", error);
        // Não limpar o token automaticamente, deixar o usuário tentar fazer login novamente
        // authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authService.login({ email, password });
      setUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));
      return { error: null };
    } catch (error) {
      console.error("AuthContext: Sign in error:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("AuthContext: Sign out error:", error);
    }
  };

  const logout = async () => {
    await signOut();
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isLoading: loading,
    signIn,
    signOut,
    logout,
  };

  // Log apenas quando o estado muda significativamente
  if (process.env.NODE_ENV === 'development') {
  console.log("AuthContext: Current state - loading:", loading, "user:", user ? "Logged in" : "Not logged in");
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
