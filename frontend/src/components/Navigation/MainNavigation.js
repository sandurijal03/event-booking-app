import React from 'react';
import './MainNavigation.css';

import AuthContext from '../../context/auth-context';
import { NavLink } from 'react-router-dom';

const MainNavigation = (props) => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className='main-navigation'>
          <div className='main-navigation__logo'>
            <h1>Easy Event</h1>
          </div>
          <div className='main-navigation__items'>
            <ul>
              {!context.token && (
                <li>
                  <NavLink to='/auth'>Authenticate</NavLink>
                </li>
              )}

              <li>
                <NavLink to='/events'>Events</NavLink>
              </li>

              {context.token && (
                <>
                  <li>
                    <NavLink to='/bookings'>Bookings</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default MainNavigation;
