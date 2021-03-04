import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import EventEmitter, { CLIENT_RELOAD, NOTE_ADDED, NOTE_REMOVED } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import ListView from 'components/ListView';
import TabHeader from 'components/TabHeader';
import NoteItem from 'components/NoteItem';
import ClientNotesGridFilter from './components/ClientNotesGridFilter';
import ClientNotesQuery from './graphql/ClientNotesQuery';
import './ClientNotesTab.scss';

class ClientNotesTab extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    notesQuery: PropTypes.query(PropTypes.pageable(PropTypes.noteEntity)).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(CLIENT_RELOAD, this.refetchNotes);
    EventEmitter.on(NOTE_ADDED, this.onNoteEvent);
    EventEmitter.on(NOTE_REMOVED, this.onNoteEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(CLIENT_RELOAD, this.refetchNotes);
    EventEmitter.off(NOTE_ADDED, this.onNoteEvent);
    EventEmitter.off(NOTE_REMOVED, this.onNoteEvent);
  }

  refetchNotes = () => this.props.notesQuery.refetch();

  /**
   * Refetch list of notes only if targetType is PLAYER
   *
   * @param targetType
   */
  onNoteEvent = ({ targetType }) => {
    if (targetType === targetTypes.PLAYER) {
      this.refetchNotes();
    }
  };

  loadMore = () => {
    const {
      notesQuery: {
        data,
        loadMore,
      },
    } = this.props;

    loadMore(data.notes.number + 1);
  };

  renderItem = note => <NoteItem note={note} />;

  render() {
    const {
      notesQuery: {
        data,
        loading,
        refetch,
      },
    } = this.props;

    const notes = data?.notes;

    if (!notes && loading) {
      return null;
    }

    return (
      <div className="ClientNotesTab">
        <TabHeader title={I18n.t('PLAYER_PROFILE.NOTES.TITLE')} />

        <ClientNotesGridFilter handleRefetch={refetch} />

        <div className="ClientNotesTab__grid">
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
      </div>
    );
  }
}

export default withRequests({
  notesQuery: ClientNotesQuery,
})(ClientNotesTab);
