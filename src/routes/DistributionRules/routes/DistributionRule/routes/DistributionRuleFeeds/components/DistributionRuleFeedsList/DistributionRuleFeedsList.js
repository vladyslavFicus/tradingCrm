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

  handleLoadMore = () => {
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
    const {
      feedsQuery: {
        data,
        loading,
      },
    } = this.props;

    const { content = [], last = true } = data?.feeds || {};

    return (
      <div className="DistributionRuleFeedsList">
        <ListView
          content={content}
          loading={loading}
          last={last}
          render={item => <FeedItem data={item} />}
          onLoadMore={this.handleLoadMore}
        />
      </div>
    );
  }
}

export default DistributionRuleFeedsList;
