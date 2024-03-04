import classes from './StartingPageContent.module.css';
import { Link } from 'react-router-dom';

const StartingPageContent = () => {
  return (
    <section className={classes.starting}>
      <h1>Welcome To Expense Tracker !!!</h1>
      <div className={classes.actions}>
        <p>
          Your Profile is Incomplete
          <Link to="/profile">
            <button type="button" className={classes.toggle}>
              Complete Profile
            </button>
          </Link>
        </p>
      </div>
    </section>
  );
};

export default StartingPageContent;
