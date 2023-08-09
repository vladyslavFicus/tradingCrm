import React from 'react';
import { Config } from '@crm/common';
import Link from 'components/Link';
import './HeaderLogo.scss';

const HeaderLogo = () => (
  <Link className="HeaderLogo" to="/brands">
    <img
      src={Config.getStaticFileUrl(Config.getBrand().id, 'header.svg')}
      alt="current-brand-logo"
      onError={(e) => {
        e.currentTarget.src = '/img/logo-placeholder.svg';
      }}
    />
  </Link>
);

export default React.memo(HeaderLogo);
