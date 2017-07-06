import React from 'react';
import { Link, withRouter } from 'react-router';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import { routes } from '../constants';

const BonusHeaderNavigation = ({ params: { id } }) => (
  <div className="bonus-header-navigation">
    {Object.keys(routes).map((url, index) => (
      <span key={url}>
        {index > 0 && ' / '}
        <Link
          className="font-size-20 btn btn-link"
          to={url.replace(/:id/, id)}
          activeClassName="color-black"
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
