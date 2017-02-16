import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TopMenu from 'components/Navigation/TopMenu';
import Sidebar from 'components/Navigation/Sidebar';
import { sidebar as sidebarItems } from 'config/menu';

class AuthenticatedLayout extends Component {
  static childContextTypes = {
    user: PropTypes.shape({
      token: PropTypes.string,
      uuid: PropTypes.string,
    }).isRequired,
    location: PropTypes.object,
    permissions: PropTypes.array,
  };

  getChildContext() {
    const {
      user,
      location,
      permissions,
    } = this.props;

    return {
      user,
      location,
      permissions,
    };
  }

  render() {
    const { children, location } = this.props;

    return <div>
      <Sidebar
        location={location}
        menuItems={sidebarItems}
      />
      <TopMenu/>

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
  permissions: PropTypes.array,
};

const mapStateToProps = (state) => ({
  user: state.auth,
  permissions: state.permissions.data,
});

export default connect(mapStateToProps, {})(AuthenticatedLayout);
