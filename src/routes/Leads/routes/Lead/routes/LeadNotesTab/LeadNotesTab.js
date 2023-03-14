import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import EventEmitter, { NOTE_RELOAD } from 'utils/EventEmitter';
import ListView from 'components/ListView';
import TabHeader from 'components/TabHeader';
import NoteItem from 'components/Note/NoteItem';
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
    EventEmitter.on(NOTE_RELOAD, this.handleNoteReload);
  }

  componentWillUnmount() {
    EventEmitter.off(NOTE_RELOAD, this.handleNoteReload);
  }

  /**
   * Refetch list of notes only if targetType is LEAD
   *
   * @param targetType
   */
  handleNoteReload = ({ targetType }) => {
    if (targetType === targetTypes.LEAD) {
      this.props.notes.refetch();
    }
  };

  handleLoadMore = () => {
    const { notes } = this.props;

    const page = notes.data.notes.number + 1;

    notes.fetchMore({ variables: { page } });
  };

  render() {
    const {
      notes: {
        data,
        loading,
        refetch,
      },
    } = this.props;

    const { content = [], last = true } = data?.notes || {};

    return (
      <div className="LeadNotesTab">
        <TabHeader title={I18n.t('LEAD_PROFILE.NOTES.TITLE')} />

        <LeadNotesTabFilter handleRefetch={refetch} />

        <div className="LeadNotesTab__list">
          <ListView
            content={content}
            loading={loading}
            last={last}
            render={item => <NoteItem note={item} />}
            onLoadMore={this.handleLoadMore}
          />
        </div>
      </div>
    );
  }
}

export default withRequests({
  notes: LeadNotesTabQuery,
})(LeadNotesTab);
