import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import _ from 'lodash';
import { getAvailableLanguages } from '../../config';
import PropTypes from '../../constants/propTypes';
import { sidebarTopMenu, sidebarBottomMenu } from '../../config/menu';
import { actionCreators as authActionCreators } from '../../redux/modules/auth';
import { actionCreators as languageActionCreators } from '../../redux/modules/language';
import { actionCreators as noteActionCreators } from '../../redux/modules/note';
import { actionCreators as userPanelsActionCreators } from '../../redux/modules/user-panels';
import { actionCreators as appActionCreators } from '../../redux/modules/app';
import { actionCreators as windowActionCreators } from '../../redux/modules/window';
import NotePopover from '../../components/NotePopover';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import UsersPanel from '../../components/UsersPanel';
import MyProfileSidebar from '../../components/MyProfileSidebar';
import parserErrorsFromServer from '../../utils/parseErrorsFromServer';
import './NewLayout.scss';

const NOTE_POPOVER = 'note-popover';
const popoverInitialState = {
  name: null,
  params: {},
};

class NewLayout extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    locale: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    onLocaleChange: PropTypes.func.isRequired,
    user: PropTypes.shape({
      token: PropTypes.string,
      uuid: PropTypes.string,
    }).isRequired,
    app: PropTypes.shape({
      showScrollToTop: PropTypes.bool.isRequired,
    }).isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    permissions: PropTypes.array,
    changeDepartment: PropTypes.func.isRequired,
    activeUserPanel: PropTypes.userPanelItem,
    userPanels: PropTypes.arrayOf(PropTypes.userPanelItem).isRequired,
    addPanel: PropTypes.func.isRequired,
    removePanel: PropTypes.func.isRequired,
    resetPanels: PropTypes.func.isRequired,
    setActivePanel: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    editNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    updateOperatorProfile: PropTypes.func.isRequired,
    setIsShowScrollTop: PropTypes.func.isRequired,
    activePanelIndex: PropTypes.number,
  };
  static defaultProps = {
    permissions: [],
    activeUserPanel: null,
    activePanelIndex: null,
  };
  static childContextTypes = {
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
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  getChildContext() {
    const {
      user,
      location,
      permissions,
      changeDepartment,
      locale,
      addPanel,
      removePanel,
    } = this.props;

    return {
      user,
      location,
      permissions,
      changeDepartment,
      locale,
      addPanel,
      removePanel,
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

  state = {
    noteChangedCallback: null,
    popover: { ...popoverInitialState },
    isOpenProfile: false,
  };

  onToggleProfile = () => {
    this.setState({ isOpenProfile: !this.state.isOpenProfile });
  };

  onProfileSubmit = async ({ language, ...nextData }) => {
    const { user: { data } } = this.props;

    this.props.onLocaleChange(language);

    if (!_.isEqualWith(data, nextData)) {
      const action = await this.props.updateOperatorProfile(this.props.user.uuid, nextData);

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

  componentWillMount() {
    window.addEventListener('scroll', this.handleScrollWindow);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScrollWindow);
  }

  setNoteChangedCallback = (cb) => {
    this.setState({ noteChangedCallback: cb });
  };

  handleScrollWindow = () => {
    const { app: { showScrollToTop } } = this.props;

    if (document.body.scrollTop > 100 && !showScrollToTop) {
      this.props.setIsShowScrollTop(true);
    } else if (showScrollToTop && document.body.scrollTop < 100) {
      this.props.setIsShowScrollTop(false);
    }
  };

  handleScrollToTop = () => {
    const { activePanelIndex } = this.props;
    const iframes = document.querySelectorAll('iframe.user-panel-content-frame');
    const currentIframe = iframes[activePanelIndex];

    if (activePanelIndex !== null && currentIframe) {
      currentIframe
        .contentWindow
        .postMessage(JSON.stringify(windowActionCreators.scrollToTop()), window.location.origin);
    } else {
      window.scrollTo(0, 0);
    }
  };

  handleAddNoteClick = (target, item, params = {}) => {
    this.setState({
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
    this.setState({
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
    const { noteChangedCallback } = this.state;

    await this.props.deleteNote(item.uuid);
    this.handlePopoverHide();

    if (typeof noteChangedCallback === 'function') {
      noteChangedCallback();
    }
  };

  handleSubmitNote = async (data) => {
    const { noteChangedCallback } = this.state;

    if (data.uuid) {
      await this.props.editNote(data.uuid, data);
    } else {
      await this.props.addNote(data);
    }

    this.handlePopoverHide();

    if (typeof noteChangedCallback === 'function') {
      noteChangedCallback();
    }
  };

  handlePopoverHide = () => {
    this.setState({ popover: { ...popoverInitialState } });
  };

  handleCloseTabs = () => {
    this.props.resetPanels();
  };

  handleUserPanelClick = (index) => {
    this.props.setActivePanel(index);
    this.props.setIsShowScrollTop(index !== null ?
      false :
      document.body.scrollTop > 100 || document.documentElement.scrollTop > 100);
  };

  render() {
    const { popover, isOpenProfile } = this.state;
    const {
      children,
      router,
      userPanels,
      activeUserPanel,
      removePanel,
      onLocaleChange,
      languages,
      app: { showScrollToTop, isInitializedScroll },
      locale,
      user,
    } = this.props;

    return (
      <div>
        <Navbar
          router={router}
          showSearch={false}
          languages={languages}
          onLocaleChange={onLocaleChange}
          onToggleProfile={this.onToggleProfile}
        />

        <Sidebar topMenu={sidebarTopMenu} bottomMenu={sidebarBottomMenu} />

        <div className="section-container">{children}</div>

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
        />

        <div className={classNames('floating-buttons', { 'bottom-60': userPanels.length > 0 })}>
          <button
            className={
              classNames('floating-buttons__circle', { rollIn: showScrollToTop, rollOut: isInitializedScroll && !showScrollToTop })
            }
            onClick={this.handleScrollToTop}
          >
            <i className="fa fa-caret-up" />
          </button>
        </div>

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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth,
  permissions: state.permissions.data,
  activeUserPanel: state.userPanels.items[state.userPanels.activeIndex] || null,
  userPanels: state.userPanels.items,
  activePanelIndex: state.userPanels.activeIndex,
  locale: state.i18n.locale,
  languages: getAvailableLanguages(),
  app: state.app,
});

export default connect(mapStateToProps, {
  changeDepartment: authActionCreators.changeDepartment,
  addPanel: userPanelsActionCreators.add,
  removePanel: userPanelsActionCreators.remove,
  resetPanels: userPanelsActionCreators.reset,
  setActivePanel: userPanelsActionCreators.setActive,
  addNote: noteActionCreators.addNote,
  editNote: noteActionCreators.editNote,
  deleteNote: noteActionCreators.deleteNote,
  onLocaleChange: languageActionCreators.setLocale,
  setIsShowScrollTop: appActionCreators.setIsShowScrollTop,
  updateOperatorProfile: authActionCreators.updateProfile,
})(NewLayout);
