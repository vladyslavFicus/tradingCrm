import React, { PureComponent } from 'react';
import { withRequests } from 'apollo';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import AccountProfileFeedGridFilter from './components/AccountProfileFeedGridFilter';
import TradingEngineFeedsQuery from './graphql/TradingEngineFeedsQuery';
import './AccountProfileFeedGrid.scss';

class AccountProfileFeedGrid extends PureComponent {
  static propTypes = {
    feedsQuery: PropTypes.query({
      feeds: PropTypes.pageable(PropTypes.feed),
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(CLIENT_RELOAD, this.refetchFeeds);
  }

  componentWillUnmount() {
    EventEmitter.off(CLIENT_RELOAD, this.refetchFeeds);
  }

  refetchFeeds = () => this.props.feedsQuery.refetch();

  handlePageChange = () => {
    const {
      feedsQuery: {
        data,
        loading,
        fetchMore,
      },
    } = this.props;

    const currentPage = data?.feeds?.page || 0;

    if (!loading) {
      fetchMore({
        variables: {
          page: currentPage + 1,
        },
      });
    }
  };

  render() {
    const {
      feedsQuery: {
        data,
        loading,
        refetch,
      },
    } = this.props;

    const { content, last, number, totalPages } = data?.feeds || {};

    return (
      <div className="AccountProfileFeedGrid">
        <AccountProfileFeedGridFilter handleRefetch={refetch} />

        <div className="AccountProfileFeedGrid__grid">
          <ListView
            dataSource={content || []}
            activePage={number + 1}
            last={last}
            totalPages={totalPages}
            render={(feed, key) => <FeedItem key={key} data={feed} />}
            onPageChange={this.handlePageChange}
            showNoResults={!loading && !content?.length}
          />
        </div>
      </div>
    );
  }
}

export default withRequests({
  feedsQuery: TradingEngineFeedsQuery,
})(AccountProfileFeedGrid);
