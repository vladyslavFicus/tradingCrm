import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from '../../constants/propTypes';
import { sidebarTopMenu, sidebarBottomMenu } from '../../config/menu';
import { actionCreators as authActionCreators } from '../../redux/modules/auth';
import { actionCreators as userPanelsActionCreators } from '../../redux/modules/user-panels';
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
    activeUserPanel: PropTypes.userPanelItem,
    userPanels: PropTypes.arrayOf(PropTypes.userPanelItem).isRequired,
    addPanel: PropTypes.func.isRequired,
    removePanel: PropTypes.func.isRequired,
    resetPanels: PropTypes.func.isRequired,
    setActivePanel: PropTypes.func.isRequired,
  };
  static childContextTypes = {
    user: PropTypes.shape({
      token: PropTypes.string,
      uuid: PropTypes.string,
    }).isRequired,
    location: PropTypes.object,
    permissions: PropTypes.array,
    changeDepartment: PropTypes.func.isRequired,
    addPanel: PropTypes.func.isRequired,
    removePanel: PropTypes.func.isRequired,
  };

  getChildContext() {
    const {
      user,
      location,
      permissions,
      changeDepartment,
      addPanel,
      removePanel,
    } = this.props;

    return {
      user,
      location,
      permissions,
      changeDepartment,
      addPanel,
      removePanel,
    };
  }

  state = {
    hasTabs: false,
  };

  handleCloseTabs = () => {
    this.props.resetPanels();
  };

  render() {
    const {
      children,
      router,
      userPanels,
      activeUserPanel,
      resetPanels,
      setActivePanel,
    } = this.props;

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
          active={activeUserPanel}
          items={userPanels}
          onItemClick={setActivePanel}
          onRemove={resetPanels}
          onClose={this.handleCloseTabs}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth,
  permissions: state.permissions.data,
  activeUserPanel: state.userPanels[state.userPanels.activeIndex] || null,
  userPanels: state.userPanels.items,
});

export default connect(mapStateToProps, {
  changeDepartment: authActionCreators.changeDepartment,
  addPanel: userPanelsActionCreators.add,
  removePanel: userPanelsActionCreators.remove,
  resetPanels: userPanelsActionCreators.reset,
  setActivePanel: userPanelsActionCreators.setActive,
})(NewLayout);
