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
    <section className="page-content">
      <div className="page-content-inner">
        <div className="single-page-block">
          <div className="margin-auto text-center max-width-500">
            <h1>{I18n.t('NOT_FOUND.TITLE')}</h1>
            <p>{I18n.t('NOT_FOUND.DESCRIPTION')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

NotFound.propTypes = {
  token: PropTypes.string.isRequired,
};

export default withStorage(['token'])(NotFound);
