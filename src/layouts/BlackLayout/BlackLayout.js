import React from 'react';
import PropTypes from 'prop-types';
import './BlackLayout.scss';

const BlackLayout = ({
  children,
}) => (
  <div className="crm-background">
    {children}
  </div>
);

BlackLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default BlackLayout;
