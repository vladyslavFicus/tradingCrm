import React, { PureComponent } from 'react';
import { getBrand, getStaticFileUrl } from 'config';
import { Link } from 'components/Link';
import './HeaderLogo.scss';

class HeaderLogo extends PureComponent {
  render() {
    return (
      <Link className="HeaderLogo" to="/brands">
        <img
          src={getStaticFileUrl(getBrand().id, 'header.svg')}
          alt="current-brand-logo"
          onError={(e) => { e.target.src = '/img/logo-placeholder.svg'; }}
        />
      </Link>
    );
  }
}

export default HeaderLogo;
