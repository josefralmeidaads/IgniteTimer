import React from 'react';

import { HeadContainer } from './styles';
import logoIgnite from '../../assets/logo.svg';
import { Scroll, Timer } from 'phosphor-react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <HeadContainer>
      <img src={logoIgnite} />
      <nav>
        <NavLink to="/">
          <Timer size={24}/>
        </NavLink>

        <NavLink to="/history">
          <Scroll size={24}/>
        </NavLink>
      </nav>
    </HeadContainer>
  );
}

export default Header;