import React from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { withStorage } from 'providers/StorageProvider';
import { Redirect } from 'react-router-dom';

const NotFound = ({ token }) => {
  if (!token) {
    return <Redirect to="/sign-in" />;
  }

  return (
    <div className="error-page">
      <h1 className="error-page__title">{I18n.t('NOT_FOUND.TITLE')}</h1>
      <p className="error-page__subtitle">{I18n.t('NOT_FOUND.DESCRIPTION')}</p>
    </div>
  );
};

NotFound.propTypes = {
  token: PropTypes.string.isRequired,
};

export default withStorage(['token'])(NotFound);
