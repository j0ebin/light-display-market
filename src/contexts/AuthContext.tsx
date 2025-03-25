import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface AuthUser {
  email: string;
  name: string;
  picture?: string;
  access_token?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (response: any) => void;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (response: any) => {
    const userData: AuthUser = {
      email: response.email,
      name: response.name,
      picture: response.picture,
    };

    // If we have a code from server-side flow, exchange it for tokens
    if (response.code) {
      try {
        const tokenResponse = await fetch('/api/auth/google/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: response.code }),
        });
        
        if (tokenResponse.ok) {
          const tokens = await tokenResponse.json();
          userData.access_token = tokens.access_token;
        }
      } catch (error) {
        console.error('Error exchanging code for tokens:', error);
      }
    }

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const getAccessToken = async () => {
    if (!user?.access_token) {
      return null;
    }
    return user.access_token;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, getAccessToken }}>
      <GoogleOAuthProvider clientId={process.env.VITE_GOOGLE_CLIENT_ID || ''}>
        {children}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
