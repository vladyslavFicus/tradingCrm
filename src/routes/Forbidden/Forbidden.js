import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import './Forbidden.scss';

class Forbidden extends PureComponent {
  render() {
    return (
      <div className="Forbidden">
        <h1 className="Forbidden__title">{I18n.t('FORBIDDEN.TITLE')}</h1>
        <p className="Forbidden__subtitle">{I18n.t('FORBIDDEN.DESCRIPTION')}</p>
      </div>
    );
  }
}

export default Forbidden;
