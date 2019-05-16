import React, { Component, Fragment } from 'react';
import { SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { isEqualWith } from 'lodash';
import PropTypes from 'constants/propTypes';
import NotePopover from 'components/NotePopover';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import UsersPanel from 'components/UsersPanel';
import MyProfileSidebar from 'components/MyProfileSidebar';
import parserErrorsFromServer from 'utils/parseErrorsFromServer';
import BackToTop from 'components/BackToTop';
import './MainLayout.scss';

const NOTE_POPOVER = 'note-popover';
const popoverInitialState = {
  name: null,
  params: {},
};

class MainLayout extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    locale: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    onLocaleChange: PropTypes.func.isRequired,
    settings: PropTypes.shape({
      sendMail: PropTypes.bool.isRequired,
      playerProfileViewType: PropTypes.oneOf(['page', 'frame']).isRequired,
      errorParams: PropTypes.object.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      brandId: PropTypes.string,
      departmentsByBrand: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
      department: PropTypes.string,
      authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
      token: PropTypes.string,
      uuid: PropTypes.string,
    }).isRequired,
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
    permissions: PropTypes.array,
    changeDepartment: PropTypes.func.isRequired,
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
    updateOperatorProfile: PropTypes.func.isRequired,
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
    permissions: [],
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
    user: PropTypes.shape({
      token: PropTypes.string,
      uuid: PropTypes.string,
    }).isRequired,
    location: PropTypes.object,
    permissions: PropTypes.array,
    changeDepartment: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
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

  constructor(props, context) {
    super(props, context);

    const { userPanels, resetPanels, history: { location } } = props;

    this.state = {
      location,
      popover: { ...popoverInitialState },
      isOpenProfile: false,
    };

    if (userPanels.some(panel => !panel.auth)) {
      resetPanels();
    }
  }

  getChildContext() {
    const {
      user,
      permissions,
      changeDepartment,
      locale,
      addPanel,
      removePanel,
      settings,
      modals,
    } = this.props;

    return {
      settings,
      user,
      permissions,
      changeDepartment,
      locale,
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
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onProfileSubmit = async ({ language, ...nextData }) => {
    const {
      user: { uuid, data },
      locale,
      onLocaleChange,
      updateOperatorProfile,
    } = this.props;

    if (language !== locale) {
      onLocaleChange(language);
    }

    if (!isEqualWith(data, nextData)) {
      const action = await updateOperatorProfile(uuid, nextData);

      if (action) {
        if (action.error && action.payload.response.fields_errors) {
          const errors = parserErrorsFromServer(action.payload.response.fields_errors);
          throw new SubmissionError(errors);
        } else if (action.payload.response && action.payload.response.error) {
          throw new SubmissionError({ __error: action.payload.response.error });
        } else {
          this.context.addNotification({
            level: 'success',
            title: I18n.t('MY_PROFILE_SIDEBAR.NOTIFICATION_SUCCESS_TITLE'),
            message: I18n.t('MY_PROFILE_SIDEBAR.NOTIFICATION_SUCCESS_MESSAGE'),
          });
        }
      }
    }
  };

  onToggleProfile = () => {
    this.updateState({ isOpenProfile: !this.state.isOpenProfile });
  };

  setNoteChangedCallback = (cb) => {
    this.updateState({ noteChangedCallback: cb });
  };

  mounted = false;

  updateState = (...args) => {
    if (this.mounted) {
      this.setState(...args);
    }
  };

  handleAddNoteClick = (target, targetUUID, playerUUID, params = {}) => {
    this.updateState({
      popover: {
        name: NOTE_POPOVER,
        params: {
          ...params,
          target,
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
    const { popover, isOpenProfile } = this.state;
    const {
      children,
      userPanelsByManager: userPanels,
      activeUserPanel,
      removePanel,
      onLocaleChange,
      languages,
      app: { sidebarTopMenu, sidebarBottomMenu },
      locale,
      user,
      toggleMenuTab,
      menuItemClick,
      replace,
      changeDepartment,
      initSidebar,
    } = this.props;

    return (
      <Fragment>
        <Choose>
          <When condition={window.isFrame}>
            {children}
          </When>
          <Otherwise>
            <Header
              user={user}
              languages={languages}
              onLocaleChange={onLocaleChange}
              onToggleProfile={this.onToggleProfile}
              onDepartmentChange={changeDepartment}
            />

            <Sidebar
              init={initSidebar}
              topMenu={sidebarTopMenu}
              bottomMenu={sidebarBottomMenu}
              menuItemClick={menuItemClick}
              onToggleTab={toggleMenuTab}
            />

            <main className="content-container">{children}</main>

            <MyProfileSidebar
              isOpen={isOpenProfile}
              onSubmit={this.onProfileSubmit}
              initialValues={{
                language: locale,
                ...user.data,
              }}
              onToggleProfile={this.onToggleProfile}
            />

            <UsersPanel
              active={activeUserPanel}
              items={userPanels}
              onItemClick={this.handleUserPanelClick}
              onRemove={removePanel}
              onClose={this.handleCloseTabs}
              onReplace={replace}
            />

            <BackToTop positionChange={userPanels.length > 0} />
          </Otherwise>
        </Choose>

        <If condition={popover.name === NOTE_POPOVER}>
          <NotePopover
            isOpen
            toggle={this.handlePopoverHide}
            {...popover.params}
          />
        </If>
      </Fragment>
    );
  }
}

export default MainLayout;
