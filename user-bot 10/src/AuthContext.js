import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    userId: null,
  });

  const initializeAuthState = () => {
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      try {
        jwtDecode(token);
        setAuthState({
          isAuthenticated: true,
          token: token,
          userId: userId,
        });
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    }
  };

  const login = ({token, user}) => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userId', user.userId);
    setAuthState({
      isAuthenticated: true,
      token: token,
      userId: user.userId
    });
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    setAuthState({
      isAuthenticated: false,
      token: null,
      userId: null,
    });
    window.location.href = '/login'; 
  };

  useEffect(() => {
    initializeAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
 