import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import classes from './AuthForm.module.css';
import AuthContext from '../store/auth-context';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmEnteredPassword, setConfirmEnteredPassword] = useState('');

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (!isLogin) {
      const confirmEnteredPasswordValue = confirmPasswordInputRef.current.value;
      setConfirmEnteredPassword(confirmEnteredPasswordValue);

      if (enteredPassword !== confirmEnteredPasswordValue) {
        alert('Password does not match. Please re-enter password...');
        return;
      }
    }

    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAyA-q0e_kzrsBi07QnurND_HsTyTaiZBw';
    } else {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAyA-q0e_kzrsBi07QnurND_HsTyTaiZBw';
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Authentication Failed';

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        authCtx.login(data.idToken, data.email);
        history.replace('/');
      })
      .catch((err) => {
        alert(err.message + 'Wrong Email/ Password');
      });
  };

  const passwordResetHandler = () => {
    history.replace('/forgotPassword');
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              id="password"
              required
              ref={confirmPasswordInputRef}
            />
          </div>
        )}
        <div className={classes.actions}>
          {
            !isLoading && <button>{isLogin ? 'Login' : 'Sign Up'}</button>
          }
          {isLoading && <p>Loading...</p>}
        </div>
        <div className={classes.actions}>
          <p>
            {isLogin ? "Don't have an Account?" : 'Have an Account?'}{' '}
            <button
              type="button"
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
        <div className={classes.actions}>
          {isLogin && (
            <button
              type="button"
              className={classes.toggle}
              onClick={passwordResetHandler}
            >
              Forgot Password?
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
