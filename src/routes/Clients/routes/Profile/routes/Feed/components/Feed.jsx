import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import parseJson from 'utils/parseJson';
import PropTypes from 'constants/propTypes';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import FeedFilterForm from './FeedFilterForm';

class Feed extends Component {
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
    feedTypes: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  };

  static contextTypes = {
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      context: { registerUpdateCacheListener },
      constructor: { name },
    } = this;

    registerUpdateCacheListener(name, this.props.feeds.refetch);
  }

  componentWillUnmount() {
    const {
      context: { unRegisterUpdateCacheListener },
      constructor: { name },
    } = this;

    unRegisterUpdateCacheListener(name);
  }

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

  handleFiltersChanged = (filters = {}) => {
    this.props.history.replace({ query: { filters } });
  };

  mapAuditEntities = entities => entities.map(entity => (
    typeof entity.details === 'string'
      ? { ...entity, details: parseJson(entity.details) }
      : entity
  ));

  render() {
    const {
      feeds: { feeds: data, loading },
      feedTypes: { feedTypes },
    } = this.props;

    const feeds = get(data, 'data') || { content: [] };
    const content = this.mapAuditEntities(feeds.content);

    const feedTypesList = get(feedTypes, 'data') || {};
    const availableTypes = Object.keys(feedTypesList)
      .filter(key => !!feedTypesList[key] && key !== '__typename');

    return (
      <Fragment>
        <FeedFilterForm
          availableTypes={availableTypes}
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
                }
                if (item.authorFullName === 'System') {
                  options.color = 'green';
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

export default Feed;
