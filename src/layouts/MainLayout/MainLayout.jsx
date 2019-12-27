import React, { PureComponent } from 'react';
import config, { getBrandId } from 'config';
import PropTypes from 'constants/propTypes';
import NotePopover from 'components/NotePopover';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
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
    addNote: PropTypes.func.isRequired,
    editNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    toggleMenuTab: PropTypes.func.isRequired,
    menuItemClick: PropTypes.func.isRequired,
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

    const { history: { location } } = props;

    this.state = {
      location,
      popover: { ...popoverInitialState },
    };
  }

  getChildContext() {
    const {
      settings,
      modals,
    } = this.props;

    return {
      settings,
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


  render() {
    const { popover } = this.state;
    const {
      children,
      app: { sidebarTopMenu, sidebarBottomMenu },
      auth,
      toggleMenuTab,
      menuItemClick,
      initSidebar,
    } = this.props;

    const isShowProductionAlert = auth.department === 'ADMINISTRATION' && config.environment.includes('prod');

    return (
      <PermissionProvider key={auth.department}>
        <Header />

        <Sidebar
          init={initSidebar}
          topMenu={sidebarTopMenu}
          bottomMenu={sidebarBottomMenu}
          menuItemClick={menuItemClick}
          onToggleTab={toggleMenuTab}
        />

        <main className="content-container">{children}</main>

        <BackToTop />

        {/* Notify ADMINISTRATION role if it's production environment */}
        <If condition={isShowProductionAlert}>
          <div className="production-footer">
            <span role="img" aria-label="fire">==== 🔥 PRODUCTION 🔥 ====</span>
          </div>
        </If>

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
