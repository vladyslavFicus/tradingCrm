import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAvailableLanguages } from '../../config/index';
import PropTypes from '../../constants/propTypes';
import { sidebarTopMenu, sidebarBottomMenu } from '../../config/menu';
import { actionCreators as authActionCreators } from '../../redux/modules/auth';
import { actionCreators as languageActionCreators } from '../../redux/modules/language';
import { actionCreators as noteActionCreators } from '../../redux/modules/note';
import { actionCreators as userPanelsActionCreators } from '../../redux/modules/user-panels';
import NotePopover from '../../components/NotePopover';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import UsersPanel from '../../components/UsersPanel';
import './NewLayout.scss';

const NOTE_POPOVER = 'note-popover';
const popoverInitialState = {
  name: null,
  params: {},
};

class NewLayout extends Component {
  static propTypes = {
    children: PropTypes.any,
    locale: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    onLocaleChange: PropTypes.func.isRequired,
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
    addNote: PropTypes.func.isRequired,
    editNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
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
    hasTabs: false,
    noteChangedCallback: null,
    popover: { ...popoverInitialState },
    sidebarTopMenu: sidebarTopMenu.map(menuItem => {
      const { items } = menuItem;

      if (items) {
        const currentMenu = items.find(subMenuItem => subMenuItem.url === this.props.location.pathname);

        if (currentMenu) {
          menuItem.isOpen = true;
        }
      } else {
        menuItem.isOpen = false;
      }

      return menuItem;
    }),
  };

  setNoteChangedCallback = (cb) => {
    this.setState({ noteChangedCallback: cb });
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

  handleOpenTap = (index) => {
    this.setState({
      sidebarTopMenu: this.state.sidebarTopMenu.map((menuItem, menuItemIndex) => {
        if (menuItemIndex !== index) {
          menuItem.isOpen = false;
        }

        if (menuItemIndex === index) {
          menuItem.isOpen = !menuItem.isOpen;
        }

        return menuItem;
      }),
    });
  };

  render() {
    const { popover } = this.state;
    const {
      children,
      router,
      userPanels,
      activeUserPanel,
      removePanel,
      setActivePanel,
      onLocaleChange,
      languages,
    } = this.props;

    return (
      <div>
        <Navbar
          router={router}
          showSearch={false}
          languages={languages}
          onLocaleChange={onLocaleChange}
        />

        <Sidebar
          topMenu={this.state.sidebarTopMenu}
          bottomMenu={sidebarBottomMenu}
          handleOpenTap={this.handleOpenTap}
        />

        <div className="section-container">{children}</div>

        <UsersPanel
          active={activeUserPanel}
          items={userPanels}
          onItemClick={setActivePanel}
          onRemove={removePanel}
          onClose={this.handleCloseTabs}
        />

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
  locale: state.i18n.locale,
  languages: getAvailableLanguages(),
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
})(NewLayout);
