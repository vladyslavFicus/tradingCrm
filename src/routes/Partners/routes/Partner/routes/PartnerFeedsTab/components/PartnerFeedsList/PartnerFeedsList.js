import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import './PartnerFeedsList.scss';

class PartnerFeedsList extends PureComponent {
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
        loading,
      },
    } = this.props;

    const currentPage = get(data, 'feeds.page') || 0;

    if (!loading) {
      fetchMore({
        variables: {
          page: currentPage + 1,
        },
      });
    }
  };

  render() {
    const { feedsQuery } = this.props;

    const { content, totalPages, last } = get(feedsQuery, 'data.feeds') || {};

    return (
      <div className="PartnerFeedsList">
        <ListView
          loading={feedsQuery.loading}
          dataSource={content || []}
          onPageChange={this.handlePageChanged}
          render={(feed, key) => <FeedItem key={key} data={feed} />}
          totalPages={totalPages}
          last={last}
          showNoResults={!feedsQuery.loading && !content?.length}
        />
      </div>
    );
  }
}

export default PartnerFeedsList;
