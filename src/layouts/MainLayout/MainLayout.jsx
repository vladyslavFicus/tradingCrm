import React, { PureComponent } from 'react';
import config, { getBrandId } from 'config';
import PropTypes from 'constants/propTypes';
import NotePopover from 'components/NotePopover';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import UsersPanel from 'components/UsersPanel';
import BackToTop from 'components/BackToTop';
import PermissionProvider from 'providers/PermissionsProvider';
import './MainLayout.scss';

const NOTE_POPOVER = 'note-popover';
const popoverInitialState = {
  name: null,
  params: {},
};

class MainLayout extends PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
    settings: PropTypes.shape({
      sendMail: PropTypes.bool.isRequired,
      playerProfileViewType: PropTypes.oneOf(['page', 'frame']).isRequired,
      errorParams: PropTypes.object.isRequired,
    }).isRequired,
    auth: PropTypes.auth.isRequired,
    app: PropTypes.shape({
      sidebarTopMenu: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        url: PropTypes.string,
        isOpen: PropTypes.bool,
        items: PropTypes.arrayOf(PropTypes.shape({
          label: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })),
      })).isRequired,
      sidebarBottomMenu: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        url: PropTypes.string,
        isOpen: PropTypes.bool,
        items: PropTypes.arrayOf(PropTypes.shape({
          label: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })),
      })).isRequired,
    }).isRequired,
    activeUserPanel: PropTypes.userPanelItem,
    userPanels: PropTypes.arrayOf(PropTypes.userPanelItem).isRequired,
    userPanelsByManager: PropTypes.arrayOf(PropTypes.userPanelItem).isRequired,
    addPanel: PropTypes.func.isRequired,
    removePanel: PropTypes.func.isRequired,
    resetPanels: PropTypes.func.isRequired,
    setActivePanel: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    editNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    toggleMenuTab: PropTypes.func.isRequired,
    menuItemClick: PropTypes.func.isRequired,
    activePanelIndex: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    initSidebar: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      multiCurrencyModal: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    history: PropTypes.shape({
      location: PropTypes.object.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    activeUserPanel: null,
    activePanelIndex: null,
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    settings: PropTypes.shape({
      sendMail: PropTypes.bool.isRequired,
      playerProfileViewType: PropTypes.oneOf(['page', 'frame']).isRequired,
      errorParams: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object,
    addPanel: PropTypes.func.isRequired,
    removePanel: PropTypes.func.isRequired,
    notes: PropTypes.shape({
      onAddNote: PropTypes.func.isRequired,
      onEditNote: PropTypes.func.isRequired,
      onAddNoteClick: PropTypes.func.isRequired,
      onEditNoteClick: PropTypes.func.isRequired,
      setNoteChangedCallback: PropTypes.func.isRequired,
      hidePopover: PropTypes.func.isRequired,
    }),
    modals: PropTypes.shape({
      multiCurrencyModal: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
    services: PropTypes.arrayOf(PropTypes.string),
  };

  mounted = false;

  constructor(props, context) {
    super(props, context);

    const { userPanels, resetPanels, history: { location } } = props;

    this.state = {
      location,
      popover: { ...popoverInitialState },
    };

    if (userPanels.some(panel => !panel.auth)) {
      resetPanels();
    }
  }

  getChildContext() {
    const {
      addPanel,
      removePanel,
      settings,
      modals,
    } = this.props;

    return {
      settings,
      addPanel,
      removePanel,
      modals,
      notes: {
        onAddNote: this.props.addNote,
        onEditNote: this.props.editNote,
        onAddNoteClick: this.handleAddNoteClick,
        onEditNoteClick: this.handleEditNoteClick,
        setNoteChangedCallback: this.setNoteChangedCallback,
        hidePopover: this.handlePopoverHide,
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.history.location !== prevState.location) {
      return {
        location: nextProps.history.location,
        noteChangedCallback: null,
        popover: { ...popoverInitialState },
      };
    }

    return null;
  }

  componentDidMount() {
    this.mounted = true;

    // Redirect to logout if brand wasn't defined
    if (!getBrandId()) {
      this.props.history.replace('/logout');
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setNoteChangedCallback = (callback) => {
    this.updateState({ noteChangedCallback: callback });
  };

  updateState = (...args) => {
    if (this.mounted) {
      this.setState(...args);
    }
  };

  handleAddNoteClick = (target, targetUUID, playerUUID, targetType, params = {}) => {
    this.updateState({
      popover: {
        name: NOTE_POPOVER,
        params: {
          ...params,
          target,
          targetType,
          initialValues: {
            targetUUID,
            playerUUID,
            pinned: false,
          },
        },
      },
    });
  };

  handleEditNoteClick = (target, item, params = {}) => {
    this.updateState({
      popover: {
        name: NOTE_POPOVER,
        params: {
          ...params,
          item,
          target,
          initialValues: { ...item },
        },
      },
    });
  };

  handlePopoverHide = () => {
    this.updateState({ popover: { ...popoverInitialState } });
  };

  handleCloseTabs = () => {
    this.props.resetPanels();
  };

  handleUserPanelClick = (index) => {
    this.props.setActivePanel(index);
  };

  render() {
    const { popover } = this.state;
    const {
      children,
      userPanelsByManager: userPanels,
      activeUserPanel,
      removePanel,
      app: { sidebarTopMenu, sidebarBottomMenu },
      auth,
      toggleMenuTab,
      menuItemClick,
      replace,
      initSidebar,
    } = this.props;

    const isShowProductionAlert = auth.department === 'ADMINISTRATION' && config.environment.includes('prod');

    return (
      <PermissionProvider key={auth.department}>
        <Choose>
          <When condition={window.isFrame}>
            {children}
          </When>
          <Otherwise>
            <Header />

            <Sidebar
              init={initSidebar}
              topMenu={sidebarTopMenu}
              bottomMenu={sidebarBottomMenu}
              menuItemClick={menuItemClick}
              onToggleTab={toggleMenuTab}
            />

            <main className="content-container">{children}</main>

            <UsersPanel
              active={activeUserPanel}
              items={userPanels}
              onItemClick={this.handleUserPanelClick}
              onRemove={removePanel}
              onClose={this.handleCloseTabs}
              onReplace={replace}
            />

            <BackToTop positionChange={userPanels.length > 0} />

            {/* Notify ADMINISTRATION role if it's production environment */}
            <If condition={isShowProductionAlert}>
              <div className="production-footer">
                <span role="img" aria-label="fire">==== 🔥 PRODUCTION 🔥 ====</span>
              </div>
            </If>
          </Otherwise>
        </Choose>

        <If condition={popover.name === NOTE_POPOVER}>
          <NotePopover
            isOpen
            toggle={this.handlePopoverHide}
            {...popover.params}
          />
        </If>
      </PermissionProvider>
    );
  }
}

export default MainLayout;
