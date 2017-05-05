import React from 'react';
import '../../styles/core.scss';
import '../../styles/global.scss';
import './BaseLayout.scss';

export const BaseLayout = ({ children }) => (
  <div style={{ height: '100%' }}>
    {children}
  </div>
);

BaseLayout.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default BaseLayout;
