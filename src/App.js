import { Switch, Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthContext from './components/store/auth-context';

function App() {
  const autCtx = useContext(AuthContext);

  return (
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
          {!autCtx.isLoggedIn && <Redirect to='/auth' />}
          </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
