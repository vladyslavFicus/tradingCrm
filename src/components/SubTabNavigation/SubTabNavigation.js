import React from 'react';
import { Link, withRouter } from 'react-router';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import './SubTabNavigation.scss';

const SubTabNavigation = ({ params: { id }, links }) => (
  <div className="sub-tab-nav">
    {Object.keys(links).map((url, index) => (
      <span key={url}>
        {index > 0 && ' / '}
        <Link
          className="sub-tab-nav__link"
          to={url.replace(/:id/, id)}
          activeClassName="sub-tab-nav__link_active"
        >
          {I18n.t(links[url])}
        </Link>
      </span>
    ))}
  </div>
);
SubTabNavigation.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  links: PropTypes.object().isRequired,
};

export default withRouter(SubTabNavigation);
