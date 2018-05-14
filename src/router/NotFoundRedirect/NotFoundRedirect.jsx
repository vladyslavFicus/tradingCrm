import React from 'react';
import { Redirect } from 'react-router-dom';

const NotFoundRedirect = () => (
  <Redirect to={{ query: { isNotFound: true } }} />
);

export default NotFoundRedirect;
