import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
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
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    noteTypes: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    fetchNoteTypes: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      context: {
        registerUpdateCacheListener,
        setNoteChangedCallback,
      },
      constructor: { name },
      props: {
        notes: { refetch },
        fetchNoteTypes,
        match: { params: { id } },
      },
      handleRefresh,
    } = this;

    fetchNoteTypes(id);
    setNoteChangedCallback(handleRefresh);
    registerUpdateCacheListener(name, refetch);
  }

  componentWillUnmount() {
    const {
      context: {
        unRegisterUpdateCacheListener,
        setNoteChangedCallback,
      },
      constructor: { name },
    } = this;

    setNoteChangedCallback(null);
    unRegisterUpdateCacheListener(name);
  }

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

  handleNoteClick = (target, data) => {
    if (data) {
      this.context.onEditNoteClick(target, data, { placement: 'left' });
    }
  };

  renderItem = data => <NoteItem data={data} handleNoteClick={this.handleNoteClick} />;

  render() {
    const {
      notes: { notes, loading },
      noteTypes: {
        data: availableTypes,
      },
      locale,
    } = this.props;

    if (!notes) {
      return null;
    }

    return (
      <Fragment>
        <TabHeader title={I18n.t('PLAYER_PROFILE.NOTES.TITLE')} />
        <NotesGridFilter
          onSubmit={this.handleFiltersChanged}
          availableTypes={availableTypes}
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
            locale={locale}
            showNoResults={!loading && !notes.content.length}
          />
        </div>
      </Fragment>
    );
  }
}

export default Notes;
