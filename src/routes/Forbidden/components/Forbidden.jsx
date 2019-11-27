import React from 'react';
import I18n from 'i18n-js';

const Forbidden = () => (
  <section className="page-content">
    <div className="page-content-inner">
      <div className="single-page-block">
        <div className="margin-auto text-center max-width-500">
          <h1>{I18n.t('FORBIDDEN.TITLE')}</h1>
          <p>{I18n.t('FORBIDDEN.DESCRIPTION')}</p>
        </div>
      </div>
    </div>
  </section>
);

export default Forbidden;
