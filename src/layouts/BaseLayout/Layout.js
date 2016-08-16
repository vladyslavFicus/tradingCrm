import React from 'react';

export const Layout = ({ children }) => (
  <div style={{ height: '100%' }}>
    {children}
  </div>
);

Layout.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default Layout;
