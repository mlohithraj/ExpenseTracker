import React, { useRef } from 'react';
import classes from './ForgotPasswordForm.module.css';

const ForgotPasswordForm = () => {
  const emailInputRef = useRef();

  const sendPasswordResetEmail = async (email) => {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAyA-q0e_kzrsBi07QnurND_HsTyTaiZBw`;

    const requestBody = {
      requestType: 'PASSWORD_RESET',
      email: email,
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
        throw new Error('Failed to send password reset email');
      }

      const data = await response.json();
      alert('Password reset email sent successfully to ' + data.email);
    } catch (error) {
      alert('Something went wrong: ' + error.message);
    }
  };

  const forgotPasswordHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    sendPasswordResetEmail(enteredEmail);
  };

  return (
    <form onSubmit={forgotPasswordHandler} className={classes.form}>
      <div className={classes.control}>
        <label>Email Id</label>
        <input type="email" required ref={emailInputRef} />
      </div>
      <button type="submit" className={classes.action}>
        Submit
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
