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
    locale: PropTypes.string.isRequired,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditModalNoteClick: PropTypes.func.isRequired,
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
      },
      handleRefresh,
    } = this;

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

  renderItem = data => <NoteItem data={data} handleNoteClick={this.context.onEditModalNoteClick} />;

  render() {
    const {
      notes: { notes, loading },
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
