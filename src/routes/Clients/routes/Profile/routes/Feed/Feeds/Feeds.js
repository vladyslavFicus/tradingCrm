import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import parseJson from 'utils/parseJson';
import EventEmitter, { PROFILE_RELOAD } from 'utils/EventEmitter';
import limitItems from 'utils/limitItems';
import PropTypes from 'constants/propTypes';
import FeedFilterForm from '../FeedFilterForm';
import FeedsQuery from './graphql/FeedsQuery';

class Feed extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    feeds: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      feeds: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.shape({
          targetUUID: PropTypes.string,
        })),
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

  handlePageChanged = () => {
    const {
      location,
      feeds: {
        data,
        loading,
        loadMore,
      },
    } = this.props;

    const defaultSize = 20;

    const { currentPage } = limitItems(data.feeds, location);

    const searchLimit = get(location, 'query.filters.size');
    const restLimitSize = searchLimit && (searchLimit - (currentPage + 1) * defaultSize);
    const limit = restLimitSize && (restLimitSize < defaultSize) ? Math.abs(restLimitSize) : defaultSize;

    if (!loading) {
      loadMore({
        page: currentPage + 1,
        limit,
      });
    }
  };

  mapAuditEntities = entities => entities.map(entity => (
    typeof entity.details === 'string'
      ? { ...entity, details: parseJson(entity.details) }
      : entity
  ));

  render() {
    const {
      feeds: { data, loading },
    } = this.props;

    const { content, last, number } = get(data, 'feeds') || { content: [] };
    const parsedContent = this.mapAuditEntities(content);

    return (
      <Fragment>
        <FeedFilterForm />
        <div className="tab-wrapper">
          <ListView
            dataSource={parsedContent}
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
            activePage={number + 1}
            last={last}
            showNoResults={!loading && !parsedContent.length}
          />
        </div>
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    feeds: FeedsQuery,
  }),
)(Feed);
