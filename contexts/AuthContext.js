"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('auth');
      if (savedAuth) {
        const parsedAuth = JSON.parse(savedAuth);
        if (parsedAuth && parsedAuth.id) {
          setUser(parsedAuth);
        }
      }
    } catch (error) {
      console.error('Error loading auth from localStorage:', error);
      localStorage.removeItem('auth');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    if (!userData || !userData.id) {
      console.error('Invalid user data provided to login');
      return;
    }
    setUser(userData);
    try {
      localStorage.setItem('auth', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving auth to localStorage:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 