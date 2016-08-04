import React from 'react';
import TopMenu from 'components/Navigation/TopMenu';
import LeftMenu from 'components/Navigation/LeftMenu';

export const Layout = ({ children }) => (
  <div>
    <LeftMenu />
    <TopMenu />

    <section className="page-content">{children}</section>
  </div>
);

Layout.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default Layout;
