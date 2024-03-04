import { useRef, useContext } from 'react';
import classes from './ProfileForm.module.css';
import AuthContext from '../store/auth-context';

const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const nameInputRef = useRef();
  const photoInputRef = useRef();

  const updateHandler = async (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredPhotoUrl = photoInputRef.current.value;

    const idToken = authCtx.token;
    const apiUrl = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAyA-q0e_kzrsBi07QnurND_HsTyTaiZBw`;

    const requestBody = {
      idToken: idToken,
      displayName: enteredName,
      photoUrl: enteredPhotoUrl,
      returnSecureToken: true,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      alert('Profile updated successfully:', data);
    } catch (error) {
      alert('Error updating profile:', error.message);
    }
  };

  return (
    <form className={classes.form} onSubmit={updateHandler}>
      <div className={classes.control}>
        <label htmlFor="name">Full Name</label>
        <input type="text" id="name" required ref={nameInputRef} />
      </div>
      <div className={classes.control}>
        <label>Profile Photo Url</label>
        <input type="text" id="photoUrl" required ref={photoInputRef} />
      </div>
      <button type="submit" className={classes.action}>
        Update
      </button>
    </form>
  );
};

export default ProfileForm;
