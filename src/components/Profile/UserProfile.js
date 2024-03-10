import ProfileForm from './ProfileForm';
import classes from './UserProfile.module.css';


const UserProfile = () => {

  
  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />

      {/* <button onClick={downloadExpensesHandler}>Download Expenses</button> */}
    </section>
  );
};

export default UserProfile;
