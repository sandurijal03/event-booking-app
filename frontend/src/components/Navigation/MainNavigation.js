import React from 'react';
import './MainNavigation.css';

import { NavLink } from 'react-router-dom';

const MainNavigation = (props) => (
  <header className='main-navigation'>
    <div className='main-navigation__logo'>
      <h1>Easy Event</h1>
    </div>
    <div className='main-navigation__items'>
      <ul>
        <li>
          <NavLink to='/auth'>Authenticate</NavLink>
        </li>
        <li>
          <NavLink to='/events'>Events</NavLink>
        </li>
        <li>
          <NavLink to='/bookings'>Bookings</NavLink>
        </li>
      </ul>
    </div>
  </header>
);

export default MainNavigation;
