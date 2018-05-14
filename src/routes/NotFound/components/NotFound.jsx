import React from 'react';
import { I18n } from 'react-redux-i18n';

const NotFound = () => (
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

export default NotFound;
