import React from 'react';
import { getBrand, getStaticFileUrl } from 'config';
import { Link } from 'components/Link';
import './HeaderLogo.scss';

const HeaderLogo = () => (
  <Link className="HeaderLogo" to="/brands">
    <img
      src={getStaticFileUrl(getBrand().id, 'header.svg')}
      alt="current-brand-logo"
      onError={(e) => {
        e.currentTarget.src = '/img/logo-placeholder.svg';
      }}
    />
  </Link>
);

export default HeaderLogo;
