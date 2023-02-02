import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Redirect } from 'react-router-dom';
import { withStorage } from 'providers/StorageProvider';
import './NotFound.scss';

type Props = {
  token: string,
};

const NotFound = (props: Props) => {
  const { token } = props;

  if (!token) {
    return <Redirect to="/sign-in" />;
  }

  return (
    <div className="NotFound">
      <h1 className="NotFound__title">{I18n.t('NOT_FOUND.TITLE')}</h1>

      <p className="NotFound__subtitle">{I18n.t('NOT_FOUND.DESCRIPTION')}</p>
    </div>
  );
};

export default compose(
  React.memo,
  withStorage(['token']),
)(NotFound);
