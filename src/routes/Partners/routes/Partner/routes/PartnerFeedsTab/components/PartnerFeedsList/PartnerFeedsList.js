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
    feedsData: PropTypes.query({
      feeds: PropTypes.response({
        content: PropTypes.arrayOf(PropTypes.feed),
        last: PropTypes.bool,
        page: PropTypes.number,
        totalElements: PropTypes.number,
      }),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      feedsData,
      feedsData: {
        loadMore,
        loading,
      },
    } = this.props;

    const currentPage = get(feedsData, 'data.feeds.data.page') || 0;

    if (!loading) {
      loadMore(currentPage + 1);
    }
  };

  renderFeedItem = (feed, key) => {
    const { authorUuid, targetUuid, authorFullName } = feed;

    let options = {
      color: 'green',
      letter: 'S',
    };

    if (authorUuid && authorFullName) {
      options = {
        color: (authorUuid === targetUuid) ? 'blue' : 'orange',
        letter: authorFullName.split(' ').splice(0, 2).map(word => word[0]).join(''),
      };
    }

    return (
      <FeedItem
        key={key}
        data={feed}
        {...options}
      />
    );
  }

  render() {
    const { feedsData } = this.props;

    const { content, totalPages, last } = get(feedsData, 'data.feeds.data') || {};

    return (
      <div className="PartnerFeedsList">
        <ListView
          dataSource={content || []}
          onPageChange={this.handlePageChanged}
          render={this.renderFeedItem}
          totalPages={totalPages}
          last={last}
          showNoResults={!feedsData.loading && !content.length}
        />
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    feedsData: getFeedsQuery,
  }),
)(PartnerFeedsList);
