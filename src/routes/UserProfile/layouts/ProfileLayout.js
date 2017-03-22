import React, { Component } from 'react';
import Tabs from '../../../components/Tabs';
import Modal from '../../../components/Modal';
import Header from '../components/Header';
import Information from '../../../components/Information/Container';
import NotePopover from '../../../components/NotePopover';
import { userProfileTabs } from '../../../config/menu';
import { targetTypes } from '../../../constants/note';
import PropTypes from '../../../constants/propTypes';
import './ProfileLayout.scss';

const NOTE_POPOVER = 'note-popover';
const popoverInitialState = {
  name: null,
  params: {},
};
const INFO_MODAL = 'info-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class ProfileLayout extends Component {
  static propTypes = {
    profile: PropTypes.shape({
      balance: PropTypes.object,
      registrationDate: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      username: PropTypes.string,
      uuid: PropTypes.string,
      languageCode: PropTypes.string,
      btag: PropTypes.string,
      affiliateId: PropTypes.string,
      profileStatus: PropTypes.string,
      suspendEndDate: PropTypes.string,
      profileTags: PropTypes.array,
    }).isRequired,
    children: PropTypes.any.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    ip: PropTypes.pageableState(PropTypes.ipEntity).isRequired,
    notes: PropTypes.pageableState(PropTypes.noteEntity).isRequired,
    lastIp: PropTypes.ipEntity,
    location: PropTypes.object.isRequired,
    availableTags: PropTypes.array.isRequired,
    addTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
    availableStatuses: PropTypes.arrayOf(PropTypes.object),
    accumulatedBalances: PropTypes.object.isRequired,
    updateSubscription: PropTypes.func.isRequired,
    changeStatus: PropTypes.func.isRequired,
    loadFullProfile: PropTypes.func.isRequired,
    fetchActiveBonus: PropTypes.func.isRequired,
    fetchIp: PropTypes.func.isRequired,
    fetchAccumulatedBalances: PropTypes.func.isRequired,
    fetchNotes: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    editNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  state = {
    popover: { ...popoverInitialState },
    modal: { ...modalInitialState },
    noteChangedCallback: null,
    informationShown: true,
  };

  getChildContext() {
    return {
      onAddNoteClick: this.handleAddNoteClick,
      onEditNoteClick: this.handleEditNoteClick,
      setNoteChangedCallback: this.setNoteChangedCallback,
    };
  }

  componentWillMount() {
    const {
      profile,
      loadFullProfile,
      fetchActiveBonus,
      fetchIp,
      fetchAccumulatedBalances,
      fetchNotes,
      params,
    } = this.props;

    if (!profile.isLoading) {
      loadFullProfile(params.id)
        .then(() => fetchNotes({ playerUUID: params.id, pinned: true }))
        .then(() => fetchActiveBonus(params.id))
        .then(() => fetchIp(params.id, { limit: 10 }))
        .then(() => fetchAccumulatedBalances(params.id));
    }
  }

  setNoteChangedCallback = (cb) => {
    this.setState({ noteChangedCallback: cb });
  };

  handleOpenModal = (name, params) => {
    this.setState({
      modal: {
        ...this.state.modal,
        name,
        params,
      },
    });
  };

  handleCloseModal = () => {
    this.setState({ modal: { ...modalInitialState } });
  };

  handleToggleInformationBlock = () => {
    this.setState({ informationShown: !this.state.informationShown });
  };

  handleAddNoteClick = (targetUUID, targetType) => (target, params = {}) => {
    this.setState({
      popover: {
        name: 'note-popover',
        params: {
          ...params,
          target,
          initialValues: {
            targetUUID,
            targetType,
            pinned: false,
            playerUUID: this.props.params.id,
          },
        },
      },
    });
  };

  handleEditNoteClick = (target, item, params = {}) => {
    this.setState({
      popover: {
        name: 'note-popover',
        params: {
          ...params,
          item,
          target,
          initialValues: { ...item },
        },
      },
    });
  };

  handleDeleteNoteClick = (item) => {
    const { noteChangedCallback } = this.state;

    return new Promise(resolve => this.props.deleteNote(item.uuid)
      .then(() => {
        this.handlePopoverHide();
        this.props.fetchNotes({ playerUUID: this.props.params.id, pinned: true });
        if (typeof noteChangedCallback === 'function') {
          noteChangedCallback();
        }

        return resolve();
      }));
  };

  handleSubmitNote = (data) => {
    const { noteChangedCallback } = this.state;

    return new Promise((resolve) => {
      if (data.uuid) {
        return resolve(this.props.editNote(data.uuid, data));
      }
      return resolve(this.props.addNote(data));
    }).then(() => {
      this.handlePopoverHide();
      this.props.fetchNotes({ playerUUID: this.props.params.id, pinned: true });

      if (typeof noteChangedCallback === 'function') {
        noteChangedCallback();
      }
    });
  };

  handlePopoverHide = () => {
    this.setState({ popover: { ...popoverInitialState } });
  };

  handleResetPasswordClick = async () => {
    const { resetPassword, profile: { data } } = this.props;

    if (data.email) {
      const action = await resetPassword({ email: data.email });

      if (action && !action.error) {
        this.handleOpenModal(INFO_MODAL, {
          header: 'Reset password',
          body: (
            <span>
              Reset password link was sent to <strong>{data.email}</strong>.
            </span>
          ),
          footer: (
            <button className="btn btn-default" onClick={this.handleCloseModal}>
              Close
            </button>
          ),
        });
      }
    }
  };

  render() {
    const { modal, popover, informationShown } = this.state;
    const {
      profile: { data },
      children,
      params,
      ip,
      lastIp,
      location,
      availableTags,
      addTag,
      deleteTag,
      availableStatuses,
      accumulatedBalances,
      updateSubscription,
      changeStatus,
      notes,
    } = this.props;

    return (
      <div className="player container panel profile-layout">
        <div className="container-fluid">
          <Header
            data={data}
            lastIp={lastIp}
            accumulatedBalances={accumulatedBalances}
            availableStatuses={availableStatuses}
            onStatusChange={changeStatus}
            availableTags={availableTags}
            addTag={addTag.bind(null, params.id)}
            deleteTag={deleteTag.bind(null, params.id)}
            onAddNoteClick={this.handleAddNoteClick(params.id, targetTypes.PROFILE)}
            onResetPasswordClick={this.handleResetPasswordClick}
          />

          <div className="row">
            <div className="col-sm-12">
              <div className="dash-text" onClick={this.handleToggleInformationBlock}>
                {!informationShown ? 'Show details' : 'Hide details'}
              </div>
              <div className="col-xs-12">
                <hr />
              </div>
            </div>
          </div>

          {
            informationShown &&
            <Information
              data={data}
              ips={ip.entities.content}
              updateSubscription={updateSubscription.bind(null, params.id)}
              onEditNoteClick={this.handleEditNoteClick}
              notes={notes}
              showNotes
            />
          }

          <div className="row">
            <section className="panel profile-user-content">
              <div className="panel-body">
                <div className="nav-tabs-horizontal">
                  <Tabs
                    items={userProfileTabs}
                    location={location}
                    params={params}
                  />

                  <div className="tab-content padding-vertical-20">
                    {children}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        {
          popover.name === NOTE_POPOVER &&
          <NotePopover
            toggle={this.handlePopoverHide}
            isOpen
            {...popover.params}
            onSubmit={this.handleSubmitNote}
            onDelete={this.handleDeleteNoteClick}
          />
        }
        {
          modal.name === INFO_MODAL &&
          <Modal
            onClose={this.handleCloseModal}
            isOpen
            {...modal.params}
          />
        }
      </div>
    );
  }
}

export default ProfileLayout;
