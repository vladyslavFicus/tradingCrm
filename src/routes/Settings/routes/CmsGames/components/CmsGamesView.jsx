import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import classNames from 'classnames';
import PropTypes from '../../../../../constants/propTypes';
import { OffsetGridView, GridViewColumn } from '../../../../../components/GridView';
import Uuid from '../../../../../components/Uuid';
import {
  freeSpinsStatusLabels,
  statusLabels,
  statusClassNames,
  statuses,
  platforms,
  technologies,
  freeSpinsStatuses,
} from '../constants';
import renderLabel from '../../../../../utils/renderLabel';
import CmsGamesGridViewFilter from './CmsGamesGridViewFilter';
import Loader from './Loader';
import history from '../../../../../router/history';

class CmsGamesView extends Component {
  static propTypes = {
    providers: PropTypes.shape({
      loading: PropTypes.bool,
      cmsProviders: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
      })),
    }),
    games: PropTypes.shape({
      variables: PropTypes.shape({
        limit: PropTypes.number.isRequired,
        offset: PropTypes.number.isRequired,
      }).isRequired,
      refetch: PropTypes.func.isRequired,
      onLoadMore: PropTypes.func.isRequired,
      loading: PropTypes.bool,
      cmsGames: PropTypes.arrayOf(PropTypes.shape({
        internalGameId: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        alias: PropTypes.string.isRequired,
        aggregator: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }).isRequired,
        provider: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }).isRequired,
        platform: PropTypes.string.isRequired,
        technology: PropTypes.string.isRequired,
        freeSpinsStatus: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
      })),
    }),
  };
  static defaultProps = {
    games: {
      loading: true,
      cmsGames: [],
    },
    providers: {
      loading: true,
      cmsGames: [],
    },
  };

  state = {
    hasMore: true,
  };

  handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } });

  handleFilterReset = () => history.replace({ query: { filters: {} } });

  handleLoadGames = async ({ limit, offset }) => {
    const { games: { onLoadMore, variables, loading } } = this.props;

    if (!loading) {
      const response = await onLoadMore({ ...variables, limit, offset });

      const nextGames = get(response, 'data.cmsGames', []);

      this.setState({ hasMore: nextGames.length > 0 });
    }
  };

  renderGame = data => (
    <div>
      <div className="font-weight-700">{data.title}</div>
      <div className="font-size-11">
        <strong>ID</strong>{': '}
        <Uuid
          uuid={data.internalGameId}
          notificationMessage={I18n.t('COMMON.NOTIFICATIONS.COPY_INTERNAL_GAME_ID.MESSAGE')}
        />
      </div>
    </div>
  );

  renderProvider = (data) => {
    const aggregator = get(data, 'aggregator.name');
    const provider = get(data, 'provider.name');

    return (
      <div className="font-weight-700 first-letter-big">
        <Choose>
          <When condition={aggregator === provider}>
            {provider}
          </When>
          <Otherwise>
            {aggregator} / {provider}
          </Otherwise>
        </Choose>
      </div>
    );
  };

  renderPlatform = data => <div className="font-weight-700 first-letter-big">{data.platform}</div>;

  renderTechnology = data => <div className="font-weight-700 first-letter-big">{data.technology}</div>;

  renderFreeSpinsStatus = data => (
    <div className="font-weight-700">
      {renderLabel(data.freeSpinsStatus, freeSpinsStatusLabels)}
    </div>
  );
  renderStatus = data => (
    <div className={classNames('font-weight-700', statusClassNames[data.status])}>
      {renderLabel(data.status, statusLabels)}
    </div>
  );

  render() {
    const { hasMore } = this.state;
    const {
      providers: {
        loading: providersLoading,
        cmsProviders,
      },
      games: {
        variables: {
          limit,
          offset,
          brandId,
          ...filters
        },
        loading,
        cmsGames,
      },
    } = this.props;
    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <span className="font-size-20 mr-auto" id="cms-games-list-header">
            {I18n.t('CMS_GAMES.TITLE')}
          </span>
        </div>

        <Choose>
          <When condition={providersLoading}>
            <Loader />
          </When>
          <Otherwise>
            <CmsGamesGridViewFilter
              onSubmit={this.handleFiltersChanged}
              onReset={this.handleFilterReset}
              initialValues={filters}
              disabled={!allowActions || loading}
              providers={cmsProviders}
              platforms={platforms}
              technologies={technologies}
              statuses={statuses}
              freeSpinsStatuses={freeSpinsStatuses}
            />
          </Otherwise>
        </Choose>

        <div className="card-body">
          <Choose>
            <When condition={loading}>
              <Loader />
            </When>
            <Otherwise>
              <OffsetGridView
                keyName="internalGameId"
                limit={limit}
                offset={offset}
                rows={cmsGames}
                hasMore={hasMore}
                onLoadMore={this.handleLoadGames}
              >
                <GridViewColumn
                  name="game"
                  header={I18n.t('CMS_GAMES.GRID_VIEW.HEADER.GAME')}
                  render={this.renderGame}
                />

                <GridViewColumn
                  name="provider"
                  header={I18n.t('CMS_GAMES.GRID_VIEW.HEADER.PROVIDER')}
                  render={this.renderProvider}
                />

                <GridViewColumn
                  name="platform"
                  header={I18n.t('CMS_GAMES.GRID_VIEW.HEADER.PLATFORM')}
                  render={this.renderPlatform}
                />

                <GridViewColumn
                  name="technology"
                  header={I18n.t('CMS_GAMES.GRID_VIEW.HEADER.TECHNOLOGY')}
                  render={this.renderTechnology}
                />

                <GridViewColumn
                  name="freeSpins"
                  header={I18n.t('CMS_GAMES.GRID_VIEW.HEADER.FREE_SPINS_STATUS')}
                  render={this.renderFreeSpinsStatus}
                />
                <GridViewColumn
                  name="freeSpins"
                  header={I18n.t('CMS_GAMES.GRID_VIEW.HEADER.STATUS')}
                  render={this.renderStatus}
                />
              </OffsetGridView>
            </Otherwise>
          </Choose>
        </div>
      </div>
    );
  }
}

export default CmsGamesView;
