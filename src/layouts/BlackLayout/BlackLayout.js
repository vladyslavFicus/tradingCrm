import React from 'react';
import PropTypes from 'prop-types';
import { getBackofficeBrand } from 'config';
import './BlackLayout.scss';

const BlackLayout = ({ children }) => (
  <div
    className="black-layout"
    style={{ backgroundImage: `url(${getBackofficeBrand().themeConfig.authBackground})` }}
  >
    {children}
  </div>
);

BlackLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default BlackLayout;
