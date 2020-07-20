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
    feedsData: PropTypes.query({
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
      feedsData: {
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
    const { feedsData: { data, loading } } = this.props;

    const { content, totalPages, last } = get(data, 'feeds') || { content: [] };

    return (
      <Fragment>
        <OperatorFeedFilterForm />

        <div className="tab-wrapper">
          <ListView
            dataSource={content}
            render={this.renderFeedItem}
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
    feedsData: FeedsQuery,
  }),
)(OperatorsFeed);
