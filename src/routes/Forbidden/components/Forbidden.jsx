import React from 'react';
import I18n from 'i18n-js';

const Forbidden = () => (
  <div className="error-page">
    <h1 className="error-page__title">{I18n.t('FORBIDDEN.TITLE')}</h1>
    <p className="error-page__subtitle">{I18n.t('FORBIDDEN.DESCRIPTION')}</p>
  </div>
);

export default Forbidden;
