import React from 'react';
import I18n from 'i18n-js';
import { Navigate } from 'react-router-dom';
import { useStorageState } from 'providers/StorageProvider';
import './NotFound.scss';

const NotFound = () => {
  // ===== Storage ===== //
  const [token] = useStorageState<string>('token');

  if (!token) {
    return <Navigate replace to="/sign-in" />;
  }

  return (
    <div className="NotFound">
      <h1 className="NotFound__title">{I18n.t('NOT_FOUND.TITLE')}</h1>

      <p className="NotFound__subtitle">{I18n.t('NOT_FOUND.DESCRIPTION')}</p>
    </div>
  );
};

export default React.memo(NotFound);
