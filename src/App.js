import { Switch, Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthContext from './components/store/auth-context';
import VerifyEmail from './components/Profile/VerifyEmail';
import ForgotPasswordForm from './components/Profile/ForgotPasswordForm';
import Expense from './components/Expenses/Expense';
import { ThemeProvider } from './components/store/theme-context';

function App() {
  const autCtx = useContext(AuthContext);

  return (
    <ThemeProvider>
      <Layout>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          {!autCtx.isLoggedIn && (
            <Route path="/auth">
              <AuthPage />
            </Route>
          )}
          <Route path="/profile">
            {autCtx.isLoggedIn && <UserProfile />}
            {!autCtx.isLoggedIn && <Redirect to="/auth" />}
          </Route>
          <Route path="/verifyAccount">
            {autCtx.isLoggedIn && <VerifyEmail />}
            {!autCtx.isLoggedIn && <Redirect to="/auth" />}
          </Route>
          <Route path="/forgotPassword">
            <ForgotPasswordForm />
          </Route>
          <Route path="/expense">
            <Expense />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
