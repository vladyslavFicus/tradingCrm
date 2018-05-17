import React, { Component, Fragment } from 'react';
import { SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import _ from 'lodash';
import PropTypes from '../../constants/propTypes';
import NotePopover from '../../components/NotePopover';
import MiniProfilePopover from '../../components/MiniProfilePopover';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import UsersPanel from '../../components/UsersPanel';
import MyProfileSidebar from '../../components/MyProfileSidebar';
import parserErrorsFromServer from '../../utils/parseErrorsFromServer';
import BackToTop from '../../components/BackToTop';
import './MainLayout.scss';

const NOTE_POPOVER = 'note-popover';
const MINI_PROFILE_POPOVER = 'mini-profile-popover';
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
  };
  static defaultProps = {
    permissions: [],
    activeUserPanel: null,
    activePanelIndex: null,
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
    miniProfile: PropTypes.shape({
      onShowMiniProfile: PropTypes.func.isRequired,
      onHideMiniProfile: PropTypes.func.isRequired,
    }),
    modals: PropTypes.shape({
      multiCurrencyModal: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  state = {
    noteChangedCallback: null,
    popover: { ...popoverInitialState },
    miniProfilePopover: { ...popoverInitialState },
    isOpenProfile: false,
  };

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
      miniProfile: {
        onShowMiniProfile: this.handleShowMiniProfile,
        onHideMiniProfile: this.handleHideMiniProfile,
      },
    };
  }

  componentWillMount() {
    const { userPanels, resetPanels } = this.props;

    if (userPanels.some(panel => !panel.auth)) {
      resetPanels();
    }
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

    if (!_.isEqualWith(data, nextData)) {
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

  initSidebar = () => {
    this.props.initSidebar(this.props.permissions);
  };

  handleAddNoteClick = (target, item, params = {}) => {
    this.updateState({
      popover: {
        name: NOTE_POPOVER,
        params: {
          ...params,
          target,
          initialValues: {
            ...item,
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

  handleDeleteNoteClick = async (item) => {
    const { deleteNote } = this.props;
    const { noteChangedCallback } = this.state;

    await deleteNote(item.uuid);
    this.handlePopoverHide();

    if (typeof noteChangedCallback === 'function') {
      noteChangedCallback();
    }
  };

  handleSubmitNote = async (data) => {
    const { addNote, editNote } = this.props;
    const { noteChangedCallback } = this.state;

    if (data.uuid) {
      await editNote(data.uuid, data);
    } else {
      await addNote(data);
    }

    this.handlePopoverHide();

    if (typeof noteChangedCallback === 'function') {
      noteChangedCallback();
    }
  };

  handlePopoverHide = () => {
    this.updateState({ popover: { ...popoverInitialState } });
  };

  handleHideMiniProfile = (callback) => {
    this.updateState({ miniProfilePopover: { ...popoverInitialState } }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  handleShowMiniProfile = (target, params, type, popoverMouseEvents) => {
    this.updateState({
      miniProfilePopover: {
        name: MINI_PROFILE_POPOVER,
        params: {
          data: params,
          target,
          type,
          popoverMouseEvents,
        },
      },
    });
  };

  handleCloseTabs = () => {
    this.props.resetPanels();
  };

  handleUserPanelClick = (index) => {
    this.props.setActivePanel(index);
  };

  render() {
    const { popover, miniProfilePopover, isOpenProfile } = this.state;
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
    } = this.props;

    return (
      <Fragment>
        <Header
          user={user}
          languages={languages}
          onLocaleChange={onLocaleChange}
          onToggleProfile={this.onToggleProfile}
          onDepartmentChange={changeDepartment}
        />

        <Sidebar
          init={this.initSidebar}
          topMenu={sidebarTopMenu}
          bottomMenu={sidebarBottomMenu}
          menuItemClick={menuItemClick}
          onToggleTab={toggleMenuTab}
        />

        <main className="content-container">{children}</main>

        <MyProfileSidebar
          isOpen={isOpenProfile}
          languages={languages}
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

        {
          popover.name === NOTE_POPOVER &&
          <NotePopover
            isOpen
            toggle={this.handlePopoverHide}
            onSubmit={this.handleSubmitNote}
            onDelete={this.handleDeleteNoteClick}
            {...popover.params}
          />
        }

        {
          miniProfilePopover.name === MINI_PROFILE_POPOVER &&
          <MiniProfilePopover
            {...miniProfilePopover.params}
          />
        }
      </Fragment>
    );
  }
}

export default MainLayout;
