import { Link } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import { useContext } from 'react';
import AuthContext from '../store/auth-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../store/theme-context';

const MainNavigation = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
  };

  const { theme, toggleTheme } = useTheme();
  console.log(theme);

  return (
    <div>
      <header className={classes.header}>
        <Link to="/">
          <div className={classes.logo}>Expense Tracker</div>
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
                <Link to="/expense">Expenses</Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link to="/verifyAccount">Verify Account</Link>
              </li>
            )}
            <div className={classes.mode}>
              <label>
                <input
                  type="checkbox"
                  onChange={toggleTheme}
                  checked={theme === 'dark'}
                />
                <span className={classes.slider}></span>
              </label>
            </div>
            {isLoggedIn && (
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default MainNavigation;
