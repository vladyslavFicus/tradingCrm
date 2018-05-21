import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';

const PermissionDenied = () => (
  <div className="margin-auto text-center max-width-500">
    <h1>{I18n.t('DASHBOARD.PERMISSION_DENIED.TITLE')}</h1>
    <p>{I18n.t('DASHBOARD.PERMISSION_DENIED.REASON')}</p>
    <Link to="/logout" className="btn">
      {I18n.t('LOGGED_FORBIDDEN.LOGOUT_BUTTON')}
    </Link>
  </div>
);

export default PermissionDenied;
