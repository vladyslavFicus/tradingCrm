import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import EventEmitter, { CLIENT_RELOAD, NOTE_RELOAD } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import ListView from 'components/ListView';
import TabHeader from 'components/TabHeader';
import NoteItem from 'components/Note/NoteItem';
import ClientNotesGridFilter from './components/ClientNotesGridFilter';
import ClientNotesQuery from './graphql/ClientNotesQuery';
import './ClientNotesTab.scss';

class ClientNotesTab extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    notesQuery: PropTypes.query(PropTypes.pageable(PropTypes.noteEntity)).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(CLIENT_RELOAD, this.handleRefetchNotes);
    EventEmitter.on(NOTE_RELOAD, this.handleNoteReload);
  }

  componentWillUnmount() {
    EventEmitter.off(CLIENT_RELOAD, this.handleRefetchNotes);
    EventEmitter.off(NOTE_RELOAD, this.handleNoteReload);
  }

  handleRefetchNotes = () => this.props.notesQuery.refetch();

  /**
   * Refetch list of notes only if targetType is PLAYER
   *
   * @param targetType
   */
  handleNoteReload = ({ targetType }) => {
    if (targetType === targetTypes.PLAYER) {
      this.handleRefetchNotes();
    }
  };

  handleLoadMore = () => {
    const {
      notesQuery: {
        data,
        fetchMore,
      },
    } = this.props;

    fetchMore({
      variables: {
        page: data.notes.number + 1,
      },
    });
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

    const { content = [], number = 0, totalPages = 0, last = true } = data?.notes || {};

    return (
      <div className="ClientNotesTab">
        <TabHeader title={I18n.t('PLAYER_PROFILE.NOTES.TITLE')} />

        <ClientNotesGridFilter handleRefetch={refetch} />

        <div className="ClientNotesTab__grid">
          <ListView
            loading={loading}
            dataSource={content}
            onPageChange={this.handleLoadMore}
            render={this.renderItem}
            activePage={number + 1}
            totalPages={totalPages}
            last={last}
            showNoResults={!loading && !content.length}
          />
        </div>
      </div>
    );
  }
}

export default withRequests({
  notesQuery: ClientNotesQuery,
})(ClientNotesTab);
