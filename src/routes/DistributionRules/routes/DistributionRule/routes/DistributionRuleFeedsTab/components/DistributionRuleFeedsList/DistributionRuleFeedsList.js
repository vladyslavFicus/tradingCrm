import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import './DistributionRuleFeedsList.scss';

class DistributionRuleFeedsList extends PureComponent {
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

    const currentPage = data?.feeds?.page || 0;

    fetchMore({
      variables: {
        page: currentPage + 1,
      },
    });
  };

  render() {
    const { feedsQuery } = this.props;

    const { content, totalPages, last } = feedsQuery.data?.feeds || {};

    return (
      <div className="DistributionRuleFeedsList">
        <ListView
          dataSource={content || []}
          onPageChange={this.handlePageChanged}
          render={(feed, key) => <FeedItem key={key} data={feed} />}
          showNoResults={!feedsQuery.loading && !content?.length}
          totalPages={totalPages}
          last={last}
        />
      </div>
    );
  }
}

export default DistributionRuleFeedsList;
