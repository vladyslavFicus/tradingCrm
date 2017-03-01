import React, { Component } from 'react';
import Tabs from '../components/Tabs';
import Header from '../components/Header';
import Information from '../components/Information/Container';
import { userProfileTabs } from 'config/menu';
import NotePopover from '../components/NotePopover';

const popoverInitialState = {
  name: null,
  params: {},
};

class ProfileLayout extends Component {
  state = {
    popover: { ...popoverInitialState },
  };

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
        .then(() => fetchNotes({ playerUUID: params.id }))
        .then(() => fetchActiveBonus(params.id))
        .then(() => fetchIp(params.id, { limit: 10 }))
        .then(() => fetchAccumulatedBalances(params.id));
    }
  }

  handleAddNoteClick = (target) => {
    this.setState({
      popover: {
        name: 'note-popover',
        params: {
          target,
          initialValues: {
            pinned: false,
          },
        },
      }
    })
  };

  handlePopoverHide = () => {
    this.setState({ popover: { ...popoverInitialState } });
  };

  handleSubmitNote = (data) => {
    console.log(data);
  };

  render() {
    const { popover } = this.state;
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
      addNote,
      editNote,
      deleteNote,
      fetchNotes,
      notes,
    } = this.props;

    return (
      <div className="player container panel ">
        <div className="container-fluid">
          <Header
            data={data}
            accumulatedBalances={accumulatedBalances}
            availableStatuses={availableStatuses}
            onStatusChange={changeStatus}
            availableTags={availableTags}
            addTag={addTag.bind(null, params.id)}
            deleteTag={deleteTag.bind(null, params.id)}
            onAddNoteClick={this.handleAddNoteClick}
          />
          <Information
            data={data}
            ips={ip.entities.content}
            updateSubscription={updateSubscription.bind(null, params.id)}
            fetchNote={fetchNotes}
            addNote={addNote}
            editNote={editNote}
            deleteNote={deleteNote}
            notes={notes}
          />

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
        {popover.name === 'note-popover' && <NotePopover
          toggle={this.handlePopoverHide}
          isOpen
          {...popover.params}
          onSubmit={this.handleSubmitNote}
        />}
      </div>
    );
  }
}

export default ProfileLayout;
