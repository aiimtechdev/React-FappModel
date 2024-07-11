import React from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_PATHS } from 'config';

const NavLogo = () => {
  return (
    <div className="logo position-relative">
      <Link to={DEFAULT_PATHS.APP}>
        <div className="img" style={{width: '12rem', backgroundPosition: 'center'}} />
      </Link>
    </div>
  );
};
export default React.memo(NavLogo);
