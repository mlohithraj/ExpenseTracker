import { useRef, useContext, useEffect, useState } from 'react';
import classes from './ProfileForm.module.css';
import AuthContext from '../store/auth-context';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const nameInputRef = useRef();
  const photoInputRef = useRef();
  const [initialName, setInitialName] = useState('');
  const [initialPhotoUrl, setInitialPhotoUrl] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const idToken = authCtx.token;
      const apiUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAyA-q0e_kzrsBi07QnurND_HsTyTaiZBw`;
      const requestBody = {
        idToken: idToken,
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
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        const userData = data.users[0];
        setInitialName(userData.displayName || '');
        setInitialPhotoUrl(userData.photoUrl || '');
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, [authCtx.token]);

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
        <input
          type="text"
          id="name"
          required
          ref={nameInputRef}
          defaultValue={initialName}
        />
      </div>
      <div className={classes.control}>
        <label>Profile Photo Url</label>
        <input
          type="text"
          id="photoUrl"
          required
          ref={photoInputRef}
          defaultValue={initialPhotoUrl}
        />
      </div>
      <Link to="/profile">
        <button type="submit" className={classes.action}>
          Update
        </button>
      </Link>
    </form>
  );
};

export default ProfileForm;
