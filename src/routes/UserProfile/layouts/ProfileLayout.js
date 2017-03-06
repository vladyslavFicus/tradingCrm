import React, { Component, PropTypes } from 'react';
import Tabs from '../components/Tabs';
import Header from '../components/Header';
import Information from '../components/Information/Container';
import NotePopover from '../components/NotePopover';
import { userProfileTabs } from 'config/menu';
import { targetTypes } from 'constants/note';
import './ProfileLayout.scss';

const NOTE_POPOVER = 'note-popover';
const popoverInitialState = {
  name: null,
  params: {},
};

class ProfileLayout extends Component {
  state = {
    popover: { ...popoverInitialState },
    noteChangedCallback: null,
    informationShowed: true,
  };

  static childContextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
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

  handleToggleInformationBlock = () => {
    this.setState({ informationShowed: !this.state.informationShowed });
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
      }
    })
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
      }
    })
  };

  handleDeleteNoteClick = (item) => {
    const { noteChangedCallback } = this.state;

    return new Promise(resolve => {
      return this.props.deleteNote(item.uuid)
        .then(() => {
          this.handlePopoverHide();
          this.props.fetchNotes({ playerUUID: this.props.params.id, pinned: true });
          if (typeof noteChangedCallback === 'function') {
            noteChangedCallback();
          }

          return resolve();
        });
    });
  };

  handleSubmitNote = (data) => {
    const { noteChangedCallback } = this.state;

    return new Promise(resolve => {
      if (data.uuid) {
        return resolve(this.props.editNote(data.uuid, data));
      } else {
        return resolve(this.props.addNote(data));
      }
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

  render() {
    const { popover, informationShowed } = this.state;
    const {
      profile: { data },
      children,
      params,
      ip,
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
            lastIp={ip.entities.content[0] || {}}
            accumulatedBalances={accumulatedBalances}
            availableStatuses={availableStatuses}
            onStatusChange={changeStatus}
            availableTags={availableTags}
            addTag={addTag.bind(null, params.id)}
            deleteTag={deleteTag.bind(null, params.id)}
            onAddNoteClick={this.handleAddNoteClick(params.id, targetTypes.PROFILE)}
          />

          <div className="row">
            <div className="col-sm-12">
              <div className="dash-text" onClick={this.handleToggleInformationBlock}>
                {!informationShowed ? 'Show details' : 'Hide details'}
              </div>
              <div className="col-xs-12">
                <hr />
              </div>
            </div>
          </div>

          {
            informationShowed &&
            <Information
              data={data}
              ips={ip.entities.content}
              updateSubscription={updateSubscription.bind(null, params.id)}
              onEditNoteClick={this.handleEditNoteClick}
              notes={notes}
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
      </div>
    );
  }
}

export default ProfileLayout;
