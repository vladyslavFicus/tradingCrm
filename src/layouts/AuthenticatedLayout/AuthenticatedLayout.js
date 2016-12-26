import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TopMenu from 'components/Navigation/TopMenu';
import Sidebar from 'components/Navigation/Sidebar';

class AuthenticatedLayout extends Component {
  static childContextTypes = {
    user: PropTypes.shape({
      token: PropTypes.string,
      uuid: PropTypes.string,
    }).isRequired,
  };

  getChildContext() {
    return { user: this.props.user };
  }

  render() {
    const { children, location } = this.props;

    return <div>
      <Sidebar
        location={location}
        menuItems={[
          { label: 'Users', url: '/users', icon: 'fa fa-users' },
          { label: 'InReview profiles', url: '/profiles-review', icon: 'fa fa-user-times' },
          { label: 'Payments', url: '/payments', icon: 'fa fa-credit-card' },
          { label: 'Bonus campaigns', url: '/bonus-campaigns', icon: 'fa fa-gift' },
          { label: 'Bonuses', url: '/bonuses', icon: 'fa fa-gift' },
          { label: 'Terms & conditions', url: '/terms', icon: 'fa fa-align-justify' },
          {
            label: 'Reports', icon: 'fa fa-align-justify',
            items: [
              { label: 'Player liability', url: '/reports/player-liability' },
              { label: 'Revenue', url: '/reports/revenue' },
            ],
          },
        ]}
      />
      <TopMenu
        location={location}
      />

      <section className="page-content">
        {children}
      </section>
    </div>;
  }
}

AuthenticatedLayout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    uuid: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth,
});

export default connect(mapStateToProps, {})(AuthenticatedLayout);
