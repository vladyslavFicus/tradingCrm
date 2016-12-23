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
  };

  getChildContext() {
    const {
      user,
      location,
    } = this.props;

    return {
      user,
      location,
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
};

const mapStateToProps = (state) => ({
  user: state.auth,
});

export default connect(mapStateToProps, {})(AuthenticatedLayout);
