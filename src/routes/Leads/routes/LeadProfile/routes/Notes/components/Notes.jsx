import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from '../../../../../../../constants/propTypes';
import NotesGridFilter from './NotesGridFilter';
import ListView from '../../../../../../../components/ListView';
import TabHeader from '../../../../../../../components/TabHeader';
import history from '../../../../../../../router/history';
import NoteItem from '../../../../../../../components/NoteItem';

class Notes extends Component {
  static propTypes = {
    notes: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      loadMoreNotes: PropTypes.func.isRequired,
      notes: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.shape({
          author: PropTypes.string,
          lastEditorUUID: PropTypes.string,
          targetUUID: PropTypes.string,
        })),
      }),
    }).isRequired,
  };

  static contextTypes = {
    onEditModalNoteClick: PropTypes.func.isRequired,
  };

  handleRefresh = (filters = {}) => {
    history.replace({ query: { filters } });
  };

  handleFiltersChanged = (filters = {}) => this.handleRefresh(filters);

  handlePageChanged = () => {
    const {
      notes: {
        loading,
        loadMoreNotes,
      },
    } = this.props;

    if (!loading) {
      loadMoreNotes();
    }
  };

  renderItem = data => <NoteItem data={data} handleNoteClick={this.context.onEditModalNoteClick} />;

  render() {
    const {
      notes: { notes: data, loading },
    } = this.props;

    if (!data) {
      return null;
    }

    const notes = get(data, 'data', { content: [] });

    return (
      <Fragment>
        <TabHeader title={I18n.t('LEAD_PROFILE.NOTES.TITLE')} />
        <NotesGridFilter
          onSubmit={this.handleFiltersChanged}
        />
        <div className="tab-wrapper">
          <ListView
            dataSource={notes.content}
            onPageChange={this.handlePageChanged}
            render={this.renderItem}
            activePage={notes.number + 1}
            totalPages={notes.totalPages}
            last={notes.last}
            lazyLoad
            showNoResults={!loading && !notes.content.length}
          />
        </div>
      </Fragment>
    );
  }
}

export default Notes;
