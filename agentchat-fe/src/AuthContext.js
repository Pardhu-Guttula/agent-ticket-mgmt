import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    agentId: null,
  });

  const initializeAuthState = () => {
    const token = localStorage.getItem('jwtToken');
    const agentId = localStorage.getItem('agentId');
    if (token && agentId) {
      try {
        jwtDecode(token);
        setAuthState({
          isAuthenticated: true,
          token: token,
          agentId: agentId,
        });
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    }
  };

  const login = ({token, uniqueAgentId}) => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('agentId', uniqueAgentId);
    setAuthState({
      isAuthenticated: true,
      token: token,
      agentId: uniqueAgentId
    });
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('agentId');
    setAuthState({
      isAuthenticated: false,
      token: null,
      agentId: null,
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
 