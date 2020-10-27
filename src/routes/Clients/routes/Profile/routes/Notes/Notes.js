import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import EventEmitter, { PROFILE_RELOAD, NOTE_ADDED, NOTE_REMOVED } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import ListView from 'components/ListView';
import TabHeader from 'components/TabHeader';
import NoteItem from 'components/NoteItem';
import ClientNotesQuery from './graphql/ClientNotesQuery';
import NotesGridFilter from './NotesGridFilter';

class Notes extends Component {
  static propTypes = {
    ...PropTypes.router,
    notes: PropTypes.query(PropTypes.pageable(PropTypes.noteEntity)).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.onProfileEvent);
    EventEmitter.on(NOTE_ADDED, this.onNoteEvent);
    EventEmitter.on(NOTE_REMOVED, this.onNoteEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.onProfileEvent);
    EventEmitter.off(NOTE_ADDED, this.onNoteEvent);
    EventEmitter.off(NOTE_REMOVED, this.onNoteEvent);
  }

  /**
   * Refetch list of notes
   */
  onProfileEvent = () => {
    this.props.notes.refetch();
  };

  /**
   * Refetch list of notes only if targetType is PLAYER
   *
   * @param targetType
   */
  onNoteEvent = ({ targetType }) => {
    if (targetType === targetTypes.PLAYER) {
      this.props.notes.refetch();
    }
  };

  loadMore = () => {
    const { notes } = this.props;

    const page = notes.data.notes.number + 1;

    notes.loadMore(page);
  };

  renderItem = note => <NoteItem note={note} />;

  render() {
    const {
      notes: {
        data,
        loading,
      },
    } = this.props;

    const notes = get(data, 'notes');

    if (!notes && loading) {
      return null;
    }

    return (
      <Fragment>
        <TabHeader title={I18n.t('PLAYER_PROFILE.NOTES.TITLE')} />
        <NotesGridFilter />
        <div className="tab-wrapper">
          <ListView
            dataSource={notes.content}
            onPageChange={this.loadMore}
            render={this.renderItem}
            activePage={notes.number + 1}
            totalPages={notes.totalPages}
            last={notes.last}
            showNoResults={!loading && !notes.content.length}
          />
        </div>
      </Fragment>
    );
  }
}

export default withRequests({
  notes: ClientNotesQuery,
})(Notes);
