import React from 'react';

function Navbar() {
  return (
    <nav className='navbar'>
      <h4>PersonalResourcePlanning</h4>
      <ul className='nav-links'>
        <li><a href="/">Home</a></li>
        <li><a href='about'>About</a></li>
        <li><a href='contact'>Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
