import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import classes from './MainNavigation.module.css';
import AuthContext from '../store/auth-context';
import { useHistory } from 'react-router-dom';

const MainNavigation = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const [logoutTimer, setLogoutTimer] = useState(null);

  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
    history.replace('/');
  };

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        logoutHandler();
      }, 5 * 60 * 1000); 

      setLogoutTimer(timer);
    } else {
      clearTimeout(logoutTimer); 
    }

    return () => {
      clearTimeout(logoutTimer);
    };
  }, [isLoggedIn, logoutTimer]);

  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer);
    const timer = setTimeout(() => {
      logoutHandler();
    }, 5 * 60 * 1000); 
    setLogoutTimer(timer);
  };

  const handleLogoutClick = () => {
    resetLogoutTimer();
    logoutHandler();
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={handleLogoutClick}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
