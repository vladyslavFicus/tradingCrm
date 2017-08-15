import React from 'react';
import PropTypes from 'prop-types';
import './NotFoundContent.scss';

const NotFoundContent = ({ locale }) => (
  <div>
    <img className="not-found-image" src={`/img/not-found/not-found-${locale}.svg`} alt="not-found" />
  </div>
);
NotFoundContent.propTypes = {
  locale: PropTypes.string.isRequired,
};

export default NotFoundContent;
