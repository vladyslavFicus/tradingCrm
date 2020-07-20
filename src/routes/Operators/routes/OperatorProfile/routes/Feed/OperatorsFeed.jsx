import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import OperatorFeedFilterForm from './components/OperatorFeedFilterForm';
import FeedsQuery from './graphql/FeedsQuery';

class OperatorsFeed extends PureComponent {
  static propTypes = {
    feedsQuery: PropTypes.query({
      feeds: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.feed),
        last: PropTypes.bool,
        page: PropTypes.number,
        totalPages: PropTypes.number,
      }),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      feedsQuery: {
        data,
        loadMore,
        loading,
      },
    } = this.props;

    const currentPage = get(data, 'feeds.page') || 0;

    if (!loading) {
      loadMore(currentPage + 1);
    }
  };

  render() {
    const { feedsQuery: { data, loading } } = this.props;

    const { content, totalPages, last } = get(data, 'feeds') || {};

    return (
      <Fragment>
        <OperatorFeedFilterForm />

        <div className="tab-wrapper">
          <ListView
            dataSource={content || []}
            render={(feed, key) => <FeedItem key={key} data={feed} />}
            onPageChange={this.handlePageChanged}
            showNoResults={!loading && !content.length}
            totalPages={totalPages}
            last={last}
          />
        </div>
      </Fragment>
    );
  }
}

export default compose(
  withRequests({
    feedsQuery: FeedsQuery,
  }),
)(OperatorsFeed);
