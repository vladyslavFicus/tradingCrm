import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import EventEmitter, { PROFILE_RELOAD } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import FeedFilterForm from '../FeedFilterForm';
import FeedsQuery from './graphql/FeedsQuery';

class Feed extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    feedsData: PropTypes.query({
      feeds: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.feed),
        last: PropTypes.bool,
        page: PropTypes.number,
        totalPages: PropTypes.number,
      }),
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.onProfileEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.onProfileEvent);
  }

  onProfileEvent = () => {
    this.props.feeds.refetch();
  };

  handlePageChange = () => {
    const {
      feedsData: {
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

  renderItem = (feed, key) => {
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
    const {
      feedsData: { data, loading },
    } = this.props;

    const { content, last, number, totalPages } = get(data, 'feeds') || { content: [] };

    return (
      <Fragment>
        <FeedFilterForm />

        <div className="tab-wrapper">
          <ListView
            dataSource={content}
            activePage={number + 1}
            last={last}
            totalPages={totalPages}
            render={this.renderItem}
            onPageChange={this.handlePageChange}
            showNoResults={!loading && !content.length}
          />
        </div>
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    feedsData: FeedsQuery,
  }),
)(Feed);
