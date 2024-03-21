import React, { useState, useEffect, useContext, createContext } from 'react';
import { Redirect } from 'react-router-dom';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  userEmail: '',
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);
  const [userEmail, setUserEmail] = useState(initialToken)

  const userIsLoggedIn = !!token;

  const loginHandler = (token, email) => {
    setToken(token);
    setUserEmail(email);
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
    alert('Logged out succesfully');
    return <Redirect to="/auth" />;
  };

  useEffect(() => {
    if (!userIsLoggedIn) {
      localStorage.removeItem('token');
    }
  }, [userIsLoggedIn]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    userEmail: userEmail,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
