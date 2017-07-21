import React from 'react';
import { Link, withRouter } from 'react-router';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import { routes } from '../constants';
import './BonusHeaderNavigation.scss';

const BonusHeaderNavigation = ({ params: { id } }) => (
  <div className="bonus-header-nav">
    {Object.keys(routes).map((url, index) => (
      <span key={url}>
        {index > 0 && ' / '}
        <Link
          className="bonus-header-nav__link"
          to={url.replace(/:id/, id)}
          activeClassName="bonus-header-nav__link_active"
        >
          {I18n.t(routes[url])}
        </Link>
      </span>
    ))}
  </div>
);
BonusHeaderNavigation.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(BonusHeaderNavigation);
