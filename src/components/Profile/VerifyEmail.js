import React, { useContext, useRef } from 'react';
import AuthContext from '../store/auth-context';
import classes from './VerifyEmail.module.css'

const VerifyEmail = () => {
  const authCtx = useContext(AuthContext);

  const verifyEmailId = async (event) => {
    event.preventDefault();

    const idToken = authCtx.token;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAyA-q0e_kzrsBi07QnurND_HsTyTaiZBw`;

    const requestBody = {
      requestType: 'VERIFY_EMAIL', 
      idToken: idToken,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      const data = await response.json();
      alert('Sent verification email to registered Email Id', data);
    } catch (error) {
      alert('Something went wrong', error.message);
    }
  };

  return (
    <form onSubmit={verifyEmailId} className={classes.form}>
      <div className={classes.control}>
        <label>Email Id</label>
        <input type="email" required />
      </div>
      <button type="submit" className={classes.action}>Verify Email address</button>
    </form>
  );
};

export default VerifyEmail;
