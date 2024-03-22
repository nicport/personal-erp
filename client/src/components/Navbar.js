import React from 'react';

function Navbar() {
  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <h5>PersonalResourcePlanning</h5>
      <ul className='navbar-nav nav-links'>
        <li><a href="/">Home</a></li>
        <li><a href='about'>Tasks</a></li>
        <li><a href='contact'>Finance</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
