import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface AuthUser {
  email: string;
  name: string;
  picture?: string;
  access_token?: string;
}

interface LoginCredentials {
  email: string;
  password?: string;
  name?: string;
  code?: string;
  picture?: string;
}

interface GoogleAuthResponse {
  access_token: string;
  user: {
    email: string;
    name: string;
    picture?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
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

  const login = async (credentials: LoginCredentials) => {
    try {
      let userData: AuthUser;

      if (credentials.code) {
        // OAuth flow
        const tokenResponse = await fetch('/api/auth/google/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: credentials.code }),
        });
        
        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange authorization code');
        }

        const data: GoogleAuthResponse = await tokenResponse.json();
        userData = {
          email: data.user.email,
          name: data.user.name,
          picture: data.user.picture,
          access_token: data.access_token,
        };
      } else if (credentials.password) {
        // Password-based authentication
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const data = await response.json();
        userData = {
          email: credentials.email,
          name: data.name || credentials.email.split('@')[0],
          access_token: data.access_token,
        };
      } else {
        // Direct login (e.g., from Google client-side flow)
        userData = {
          email: credentials.email,
          name: credentials.name || credentials.email.split('@')[0],
          picture: credentials.picture,
        };
      }

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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
      <GoogleOAuthProvider 
        clientId={process.env.VITE_GOOGLE_CLIENT_ID || ''}
        onScriptLoadSuccess={() => console.log('Google OAuth script loaded successfully')}
        onScriptLoadError={() => console.error('Failed to load Google OAuth script')}
      >
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
