import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import './App.css';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthPage from './pages/Auth';
import Bookings from './pages/Bookings';
import Events from './pages/Events';
import AuthContext from './context/auth-context';

class App extends React.Component {
  state = {
    token: null,
    userId: null,
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token, userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <Router>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.token,
            login: this.login,
            logout: this.logout,
          }}
        >
          <MainNavigation />
          <main className='main-content'>
            <Switch>
              {this.state.token && <Redirect exact from='/' to='/events' />}
              {this.state.token && <Redirect exact from='/auth' to='/events' />}
              {!this.state.token && <Route path='/auth' component={AuthPage} />}
              <Route exact path='/events' component={Events} />
              {this.state.token && (
                <Route exact path='/bookings' component={Bookings} />
              )}
              {!this.state.token && <Redirect exact to='/auth' />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </Router>
    );
  }
}

export default App;
