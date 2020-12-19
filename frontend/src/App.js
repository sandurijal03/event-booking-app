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

class App extends React.Component {
  render() {
    return (
      <Router>
        <MainNavigation />
        <main className='main-content'>
          <Switch>
            <Redirect exact from='/' to='/auth' />
            <Route path='/auth' component={AuthPage} />
            <Route exact path='/events' component={Events} />
            <Route exact path='/bookings' component={Bookings} />
          </Switch>
        </main>
      </Router>
    );
  }
}

export default App;
