import React, { PureComponent } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import EventEmitter, { NOTE_ADDED, NOTE_REMOVED } from 'utils/EventEmitter';
import ListView from 'components/ListView';
import TabHeader from 'components/TabHeader';
import NoteItem from 'components/NoteItem';
import LeadNotesTabQuery from './graphql/LeadNotesTabQuery';
import LeadNotesTabFilter from './components/LeadNotesTabFilter';
import './LeadNotesTab.scss';

class LeadNotesTab extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    notes: PropTypes.query({
      notes: PropTypes.pageable(PropTypes.noteEntity),
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(NOTE_ADDED, this.onNoteEvent);
    EventEmitter.on(NOTE_REMOVED, this.onNoteEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(NOTE_ADDED, this.onNoteEvent);
    EventEmitter.off(NOTE_REMOVED, this.onNoteEvent);
  }

  onNoteEvent = () => {
    this.props.notes.refetch();
  };

  loadMore = () => {
    const { notes } = this.props;

    const page = notes.data.notes.number + 1;

    notes.loadMore({ page });
  };

  renderItem = note => <NoteItem note={note} />;

  render() {
    const {
      notes: { data, loading, refetch },
    } = this.props;

    const { content, number, totalPages, last } = get(data, 'notes') || {
      content: [],
    };

    return (
      <div className="LeadNotesTab">
        <TabHeader title={I18n.t('LEAD_PROFILE.NOTES.TITLE')} />
        <LeadNotesTabFilter handleRefetch={refetch} />
        <div className="LeadNotesTab__list">
          <ListView
            dataSource={content}
            onPageChange={this.loadMore}
            render={this.renderItem}
            activePage={number + 1}
            totalPages={totalPages}
            last={last}
            lazyLoad
            showNoResults={!loading && !content.length}
          />
        </div>
      </div>
    );
  }
}

export default withRequests({
  notes: LeadNotesTabQuery,
})(LeadNotesTab);
