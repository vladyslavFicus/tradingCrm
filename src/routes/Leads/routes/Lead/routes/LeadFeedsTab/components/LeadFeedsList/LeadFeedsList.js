import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import './LeadFeedsList.scss';

class LeadFeedsList extends PureComponent {
  static propTypes = {
    feedsQuery: PropTypes.query({
      feeds: PropTypes.pageable(PropTypes.feed),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      feedsQuery: {
        data,
        fetchMore,
      },
    } = this.props;

    const currentPage = get(data, 'feeds.page') || 0;

    fetchMore({
      variables: {
        page: currentPage + 1,
      },
    });
  };

  render() {
    const { feedsQuery } = this.props;

    const { content, totalPages, last } = get(feedsQuery, 'data.feeds') || {};

    return (
      <div className="LeadFeedsList">
        <ListView
          dataSource={content || []}
          onPageChange={this.handlePageChanged}
          render={(feed, key) => <FeedItem key={key} data={feed} />}
          totalPages={totalPages}
          last={last}
          showNoResults={!feedsQuery.loading && (!content || !content.length)}
        />
      </div>
    );
  }
}

export default LeadFeedsList;
