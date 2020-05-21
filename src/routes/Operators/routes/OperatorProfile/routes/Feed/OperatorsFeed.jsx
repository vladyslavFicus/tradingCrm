import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import parseJson from 'utils/parseJson';
import PropTypes from 'constants/propTypes';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import OperatorsFeedFilter from './components/OperatorsFeedFilter';
import { FeedsQuery } from './graphql';

class OperatorsFeed extends Component {
  static propTypes = {
    ...PropTypes.router,
    feeds: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      loadMoreFeeds: PropTypes.func.isRequired,
      feeds: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.shape({
          targetUUID: PropTypes.string,
        })),
      }),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      feeds: {
        loading,
        loadMoreFeeds,
      },
    } = this.props;

    if (!loading) {
      loadMoreFeeds();
    }
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

  render() {
    const {
      feeds: { data: { feeds: data }, loading },
      match: { params: { id } },
    } = this.props;

    const feeds = get(data, 'data.feeds.data') || { content: [] };
    const content = this.mapAuditEntities(feeds.content);

    console.log('feeds', this.props);
    console.log('feeds feeds', feeds);
    return (
      <Fragment>
        <OperatorsFeedFilter
          playerUUID={id}
          onSubmit={this.handleFiltersChanged}
        />

        <div className="tab-wrapper">
          <ListView
            dataSource={content}
            onPageChange={this.handlePageChanged}
            render={(item, key) => {
              const options = {
                color: 'blue',
                letter: item.authorFullName.split(' ').splice(0, 2).map(word => word[0]).join(''),
              };

              if (item.authorUuid !== item.targetUuid) {
                if (item.authorUuid) {
                  options.color = 'orange';
                } else {
                  options.color = '';
                  options.letter = 's';
                }
              }

              return (
                <FeedItem
                  key={key}
                  data={item}
                  {...options}
                />
              );
            }}
            activePage={feeds.number + 1}
            totalPages={feeds.totalPages}
            last={feeds.last}
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
