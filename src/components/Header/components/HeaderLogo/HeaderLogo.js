import React, { PureComponent } from 'react';
import { getLogo } from 'config';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
import './HeaderLogo.scss';

class HeaderLogo extends PureComponent {
  static propTypes = {
    brands: PropTypes.arrayOf(
      PropTypes.brand.isRequired,
    ).isRequired,
  };

  render() {
    const { brands } = this.props;

    return (
      <Link className="HeaderLogo" to={brands.length > 1 ? '/brands' : '/'}>
        <img
          src={getLogo()}
          alt="current-brand-logo"
          onError={(e) => { e.target.src = '/img/logo-placeholder.svg'; }}
        />
      </Link>
    );
  }
}

export default withStorage(['brands'])(HeaderLogo);
