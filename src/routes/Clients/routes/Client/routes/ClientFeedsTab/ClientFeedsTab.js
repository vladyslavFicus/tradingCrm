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

  handleLoadMore = () => {
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

    const { content = [], last = true } = data?.feeds || {};

    return (
      <div className="ClientFeedsTab">
        <ClientFeedsFilterForm handleRefetch={refetch} />

        <div className="ClientFeedsTab__grid">
          <ListView
            content={content}
            loading={loading}
            last={last}
            render={item => <FeedItem data={item} />}
            onLoadMore={this.handleLoadMore}
          />
        </div>
      </div>
    );
  }
}

export default withRequests({
  feedsQuery: FeedsQuery,
})(ClientFeedsTab);
