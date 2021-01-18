import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import FeedFilterForm from '../FeedFilterForm';
import FeedsQuery from './graphql/FeedsQuery';

class Feed extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    feedsQuery: PropTypes.query({
      feeds: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.feed),
        last: PropTypes.bool,
        page: PropTypes.number,
        totalPages: PropTypes.number,
      }),
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(CLIENT_RELOAD, this.onProfileEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(CLIENT_RELOAD, this.onProfileEvent);
  }

  onProfileEvent = () => {
    this.props.feedsQuery.refetch();
  };

  handlePageChange = () => {
    const {
      feedsQuery: {
        data,
        loading,
        loadMore,
      },
    } = this.props;

    const currentPage = get(data, 'feeds.page') || 0;

    if (!loading) {
      loadMore(currentPage + 1);
    }
  };

  render() {
    const {
      feedsQuery: { data, loading, refetch },
    } = this.props;

    const { content, last, number, totalPages } = get(data, 'feeds') || {};

    return (
      <Fragment>
        <FeedFilterForm handleRefetch={refetch} />

        <div className="tab-wrapper">
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
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    feedsQuery: FeedsQuery,
  }),
)(Feed);
