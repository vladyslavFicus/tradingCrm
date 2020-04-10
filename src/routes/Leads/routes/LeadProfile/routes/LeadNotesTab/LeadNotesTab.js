import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import ListView from 'components/ListView';
import TabHeader from 'components/TabHeader';
import NoteItem from 'components/NoteItem';
import LeadNotesTabQuery from './graphql/LeadNotesTabQuery';
import LeadNotesTabFilter from './components/LeadNotesTabFilter';

class LeadNotesTab extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    notes: PropTypes.query({
      notes: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.object),
      }),
    }).isRequired,
  };

  static contextTypes = {
    onEditModalNoteClick: PropTypes.func.isRequired,
  };

  handleApplyFilters = (filters) => {
    this.props.history.replace({ query: { filters } });
  };

  handlePageChanged = () => {
    const {
      notes: { data, loading, loadMore, variables },
    } = this.props;

    const number = get(data, 'notes.data.number') || 0;

    if (!loading) {
      loadMore({ ...variables, page: number + 1 });
    }
  };

  renderItem = data => (
    <NoteItem data={data} handleNoteClick={this.context.onEditModalNoteClick} />
  );

  render() {
    const {
      notes: { data, loading },
    } = this.props;

    const { content, number, totalPages, last } = get(data, 'notes.data') || {
      content: [],
    };

    return (
      <Fragment>
        <TabHeader title={I18n.t('LEAD_PROFILE.NOTES.TITLE')} />
        <LeadNotesTabFilter handleApplyFilters={this.handleApplyFilters} />
        <div className="tab-wrapper">
          <ListView
            dataSource={content}
            onPageChange={this.handlePageChanged}
            render={this.renderItem}
            activePage={number + 1}
            totalPages={totalPages}
            last={last}
            lazyLoad
            showNoResults={!loading && !content.length}
          />
        </div>
      </Fragment>
    );
  }
}

export default withRequests({
  notes: LeadNotesTabQuery,
})(LeadNotesTab);
