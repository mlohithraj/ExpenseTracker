import React, { useState, useEffect, useContext, createContext } from 'react';
import { Redirect } from 'react-router-dom';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

// const ThemeContext = createContext()

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
    alert('Logged out succesfully');
    <Redirect to="/auth" />;
  };

  useEffect(() => {
    if (!userIsLoggedIn) {
      localStorage.removeItem('token');
    }
  }, [userIsLoggedIn]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };



  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
  // export const useTheme = () => {
  //   useContext(ThemeContext);
  // };

  // export const ThemeProvider = (children) => {
  //   const [isDarkMode, setIsDarkMode] = useState(false)

  //   const toggleTheme = () => {
  //     setIsDarkMode((prevState) => !prevState)
  //   }

  //   const theme = isDarkMode ? "dark" : "light"

  //   return (
  //     <ThemeContext.Provider value={{theme, toggleTheme}}>
  //       {children}
  //     </ThemeContext.Provider>
  //   )
  // }

export default AuthContext;
