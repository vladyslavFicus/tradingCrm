import React from 'react';
import TopMenu from 'components/Navigation/TopMenu';
import Sidebar from 'components/Navigation/Sidebar';

export const Layout = (props) => (
  <div>
    <Sidebar
      location={props.location}
      menuItems={[
        { label: 'Users', url: '/users', icon: 'fa fa-users' },
        { label: 'Transactions', url: '/transactions', icon: 'fa fa-credit-card' },
        { label: 'Bonus campaigns', url: '/bonus-campaigns', icon: 'fa fa-gift' },
        { label: 'Bonuses', url: '/bonuses', icon: 'fa fa-gift' },
      ]}
    />
    <TopMenu location={props.location}/>

    <section className="page-content">{props.children}</section>
  </div>
);

Layout.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default Layout;
