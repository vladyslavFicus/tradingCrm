import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { getCrmBrandStaticFileUrl } from 'config';
import './BlackLayout.scss';

const BlackLayout = ({ children }) => (
  <Suspense fallback={null}>
    <div
      className="black-layout"
      style={{ backgroundImage: `url(${getCrmBrandStaticFileUrl('assets/auth-background.svg')})` }}
    >
      {children}
    </div>
  </Suspense>
);

BlackLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default BlackLayout;
