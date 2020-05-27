import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import parseJson from 'utils/parseJson';
import PropTypes from 'constants/propTypes';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import OperatorsFeedFilter from './components/OperatorsFeedFilter';
import FeedsQuery from './graphql/FeedsQuery';

class OperatorsFeed extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    feeds: PropTypes.query({
      content: PropTypes.arrayOf(PropTypes.shape({
        targetUUID: PropTypes.string,
        authorUuid: PropTypes.string,
        authorFullName: PropTypes.string,
      })),
    }).isRequired,
  };

  handlePageChanged = () => {
    const { feeds: { data, loadMore } } = this.props;
    const currentPage = get(data, 'feeds.data.number') || 0;

    loadMore(currentPage + 1);
  };

  handleFiltersChanged = (filterFields = {}) => {
    const filters = Object.keys(filterFields).reduce((acc, key) => (
      filterFields[key] ? { ...acc, [key]: filterFields[key] } : acc
    ), {});
    this.props.history.replace({ query: { filters } });
  };

  mapAuditEntities = entities => entities.map(entity => (
    typeof entity.details === 'string'
      ? { ...entity, details: parseJson(entity.details) }
      : entity
  ));

  renderFeedItem = (feed, key) => {
    const { authorUuid, targetUuid, authorFullName } = feed;

    const options = {
      color: 'blue',
      letter: authorFullName.split(' ').splice(0, 2).map(word => word[0]).join(''),
    };

    if (authorUuid !== targetUuid) {
      if (authorUuid) {
        options.color = 'orange';
      } else {
        options.color = '';
        options.letter = 's';
      }
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
      feeds: { data, loading },
      match: { params: { id } },
    } = this.props;

    const { content, totalPages, last } = get(data, 'feeds.data') || { content: [] };
    const contentWitAuditEntities = this.mapAuditEntities(content);

    return (
      <Fragment>
        <OperatorsFeedFilter
          playerUUID={id}
          onSubmit={this.handleFiltersChanged}
        />
        <div className="tab-wrapper">
          <ListView
            dataSource={contentWitAuditEntities}
            onPageChange={this.handlePageChanged}
            render={this.renderFeedItem}
            totalPages={totalPages}
            last={last}
            lazyLoad
            showNoResults={!loading && !content.length}
          />
        </div>
      </Fragment>
    );
  }
}

export default compose(
  withRequests({
    feeds: FeedsQuery,
  }),
)(OperatorsFeed);
