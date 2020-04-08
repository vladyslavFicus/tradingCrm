import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { withRequests } from 'apollo';
import { TextRow } from 'react-placeholder/lib/placeholders';
import PropTypes from 'constants/propTypes';
import countries from 'utils/countryList';
import Placeholder from 'components/Placeholder';
import NotificationsGridFilters from '../NotificationGridFilter';
import NotificationsGrid from '../NotificationsGrid';
import NotificationCenterQuery from './graphql/NotificationCenterQuery';
import { NOTIFICATIONS_SIZE } from '../../constants';
import './Notifications.scss';

class Notifications extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    location: PropTypes.shape({
      query: PropTypes.object,
    }).isRequired,
    notificationCenterQuery: PropTypes.shape({
      read: PropTypes.bool,
      uuid: PropTypes.string,
      priority: PropTypes.string,
      client: PropTypes.shape({
        uuid: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        languageCode: PropTypes.string,
      }),
      createdAt: PropTypes.string,
      type: PropTypes.string,
      subtype: PropTypes.string,
      details: PropTypes.shape({
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        currency: PropTypes.string,
      }),
    }).isRequired,
  };

  handleFiltersChanged = (filters = {}) => {
    this.props.history.replace({ query: { filters } });
  };

  handleFilterReset = () => this.props.history.replace({ query: { filters: {} } });

  handlePageChanged = () => {
    const {
      notificationCenterQuery: {
        variables: {
          args,
        },
        fetchMore,
        loading,
        data,
      },
    } = this.props;

    if (!loading) {
      const currentPage = get(data, 'notificationCenter.data.number', 0);
      const searchLimit = get(data, 'notificationCenter.data.totalElements', 0);

      const restLimitSize = searchLimit && (searchLimit - (currentPage + 1) * NOTIFICATIONS_SIZE);
      const size = restLimitSize && (restLimitSize < NOTIFICATIONS_SIZE)
        ? restLimitSize
        : NOTIFICATIONS_SIZE;

      fetchMore({
        variables: {
          args: {
            ...args,
            page: { from: currentPage + 1, size },
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          // eslint-disable-next-line no-param-reassign
          fetchMoreResult.notificationCenter.data.content = [
            ...previousResult.notificationCenter.data.content,
            ...fetchMoreResult.notificationCenter.data.content,
          ];

          return fetchMoreResult;
        } });
    }
  };

  render() {
    const {
      notificationCenterQuery: {
        loading,
        data,
      },
      location: { query },
    } = this.props;

    const filters = get(query, 'filters', {});

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    const entities = get(data, 'notificationCenter.data.content', []);
    const searchLimit = get(data, 'notificationCenter.data.totalElements', 0);
    const isLastPage = get(data, 'notificationCenter.data.last', false);

    return (
      <div className="Notifications">
        <div className="card-heading">
          <Placeholder
            ready={!loading}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow
                  className="animated-background"
                  style={{ width: '220px', height: '20px' }}
                />
              </div>
            )}
          >
            <span className="font-size-20">
              {entities.length} {I18n.t('NOTIFICATION_CENTER.TITLE')}
            </span>
          </Placeholder>
        </div>
        <NotificationsGridFilters
          initialValues={filters}
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
          countries={countries}
        />
        <div className="card-body">
          <NotificationsGrid
            entities={entities}
            handlePageChanged={this.handlePageChanged}
            searchLimit={searchLimit}
            isLastPage={isLastPage}
            loading={loading}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(withRequests({
  notificationCenterQuery: NotificationCenterQuery,
})(Notifications));
