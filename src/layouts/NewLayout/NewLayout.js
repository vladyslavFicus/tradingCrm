import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from '../../constants/propTypes';
import { sidebarTopMenu, sidebarBottomMenu } from '../../config/menu';
import { actionCreators as authActionCreators } from '../../redux/modules/auth';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import UsersPanel from '../../components/UsersPanel';
import './NewLayout.scss';

class NewLayout extends Component {
  static propTypes = {
    children: PropTypes.any,
    user: PropTypes.shape({
      token: PropTypes.string,
      uuid: PropTypes.string,
    }).isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.object,
    permissions: PropTypes.array,
    changeDepartment: PropTypes.func.isRequired,
  };
  static childContextTypes = {
    user: PropTypes.shape({
      token: PropTypes.string,
      uuid: PropTypes.string,
    }).isRequired,
    location: PropTypes.object,
    permissions: PropTypes.array,
    changeDepartment: PropTypes.func.isRequired,
  };

  getChildContext() {
    const {
      user,
      location,
      permissions,
      changeDepartment,
    } = this.props;

    return {
      user,
      location,
      permissions,
      changeDepartment,
    };
  }

  state = {
    hasTabs: false,
  };

  handleCloseTabs = () => {
    this.setState({ hasTabs: false });
  };

  render() {
    const { children, router, userPanels } = this.props;

    return (
      <div>
        <Navbar
          router={router}
          showSearch={false}
        />
        <Sidebar
          topMenu={sidebarTopMenu}
          bottomMenu={sidebarBottomMenu}
        />

        <div className="section-container">
          {children}
        </div>

        <UsersPanel
          items={userPanels}
          onClose={this.handleCloseTabs}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth,
  permissions: state.permissions.data,
  userPanels: state.userPanels,
});

export default connect(mapStateToProps, {
  changeDepartment: authActionCreators.changeDepartment,
})(NewLayout);
