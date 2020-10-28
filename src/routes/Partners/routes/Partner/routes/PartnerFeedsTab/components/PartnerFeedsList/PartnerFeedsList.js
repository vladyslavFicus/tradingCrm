import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import getFeedsQuery from './graphql/getFeedsQuery';
import './PartnerFeedsList.scss';

class PartnerFeedsList extends PureComponent {
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
    const { feedsQuery } = this.props;

    const { content, totalPages, last } = get(feedsQuery, 'data.feeds') || {};

    return (
      <div className="PartnerFeedsList">
        <ListView
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

export default compose(
  withRouter,
  withRequests({
    feedsQuery: getFeedsQuery,
  }),
)(PartnerFeedsList);
