import React from 'react';
import 'styles/core.scss';

export const Layout = ({ children }) => (
  <div style={{ height: '100%' }}>
    {children}
  </div>
);

Layout.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default Layout;
