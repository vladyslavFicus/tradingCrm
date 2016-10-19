import React, { PropTypes } from 'react';
import TopMenu from 'components/Navigation/TopMenu';
import Sidebar from 'components/Navigation/Sidebar';

export const Layout = ({ children, location }) => (
  <div>
    <Sidebar
      location={location}
      menuItems={[
        { label: 'Users', url: '/users', icon: 'fa fa-users' },
        { label: 'Transactions', url: '/transactions', icon: 'fa fa-credit-card' },
        { label: 'Bonus campaigns', url: '/bonus-campaigns', icon: 'fa fa-gift' },
        { label: 'Bonuses', url: '/bonuses', icon: 'fa fa-gift' },
        { label: 'InReview profiles', url: '/users/review', icon: 'fa fa-user-times' },
      ]}
    />
    <TopMenu
      location={location}
    />

    <section className="page-content">
      {children}
    </section>
  </div>
);

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
};

export default Layout;
