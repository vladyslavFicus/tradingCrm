import React from 'react';
import TopMenu from 'components/Navigation/TopMenu';
import Sidebar from 'components/Navigation/Sidebar';

export const Layout = (props) => (
  <div>
    <Sidebar location={props.location}/>
    <TopMenu location={props.location}/>

    <section className="page-content">{props.children}</section>
  </div>
);

Layout.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default Layout;
