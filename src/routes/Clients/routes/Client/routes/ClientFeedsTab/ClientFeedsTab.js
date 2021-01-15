import React, { PureComponent } from 'react';
import { withRequests } from 'apollo';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import ClientFeedsFilterForm from './components/ClientFeedsFilterForm';
import FeedsQuery from './graphql/FeedsQuery';
import './ClientFeedsTab.scss';

class ClientFeedsTab extends PureComponent {
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
        loadMore,
      },
    } = this.props;

    const currentPage = data?.feeds?.page || 0;

    if (!loading) {
      loadMore(currentPage + 1);
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
      <div className="ClientFeedsTab">
        <ClientFeedsFilterForm handleRefetch={refetch} />

        <div className="ClientFeedsTab__grid">
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
  feedsQuery: FeedsQuery,
})(ClientFeedsTab);
