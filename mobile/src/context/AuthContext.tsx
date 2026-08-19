import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  login as loginApi,
  register as registerApi,
} from "../api/auth";

import {
  clearTokens,
  saveTokens,
} from "../storage/tokenStorage";

interface User {
  userId: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } 
    
    catch {
      await clearTokens();
      setUser(null);
    } 
    
    finally {
      setLoading(false);
    }
  }

  async function login(
    email: string,
    password: string
  ) {
    const response = await loginApi(
      email,
      password
    );

    await saveTokens(
      response.accessToken,
      response.refreshToken
    );

    setUser({
      userId: response.userId,
      name: response.name,
      email,
    });
  }

  async function register(
    name: string,
    email: string,
    password: string
  ) {
    const response = await registerApi(
      name,
      email,
      password
    );

    await saveTokens(
      response.accessToken,
      response.refreshToken
    );

    setUser({
      userId: response.userId,
      name: response.name,
      email,
    });
  }

  async function logout() {
    await clearTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}