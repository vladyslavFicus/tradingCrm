import React from 'react';
import I18n from 'i18n-js';
import './Forbidden.scss';

const Forbidden = () => (
  <div className="Forbidden">
    <h1 className="Forbidden__title">{I18n.t('FORBIDDEN.TITLE')}</h1>

    <p className="Forbidden__subtitle">{I18n.t('FORBIDDEN.DESCRIPTION')}</p>
  </div>
);

export default React.memo(Forbidden);
