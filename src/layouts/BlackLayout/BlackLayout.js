import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { getBackofficeBrand } from 'config';
import './BlackLayout.scss';

const BlackLayout = ({ children }) => (
  <Suspense fallback={null}>
    <div
      className="black-layout"
      style={{ backgroundImage: `url(${getBackofficeBrand().themeConfig.authBackground})` }}
    >
      {children}
    </div>
  </Suspense>
);

BlackLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default BlackLayout;
