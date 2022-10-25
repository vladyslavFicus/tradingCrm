import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { getCrmBrandStaticFileUrl } from 'config';
import './UnauthorizedLayout.scss';

const UnauthorizedLayout = ({ children }) => (
  <Suspense fallback={null}>
    <div
      className="UnauthorizedLayout"
      style={{ backgroundImage: `url(${getCrmBrandStaticFileUrl('assets/auth-background.svg')})` }}
    >
      {children}
    </div>
  </Suspense>
);

UnauthorizedLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default UnauthorizedLayout;
