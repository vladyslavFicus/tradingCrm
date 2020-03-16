import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import Grid, { GridColumn } from 'components/Grid';
import getSocialTradingProvidersQuery from './graphql/getSocialTradingProvidersQuery';
import './ProvidersGrid.scss';

class ProvidersGrid extends PureComponent {
  static propTypes = {
    handleRowClick: PropTypes.func.isRequired,
    getSocialTradingProviders: PropTypes.shape({
      loading: PropTypes.bool,
      data: PropTypes.shape({
        socialTrading: PropTypes.shape({
          providers: PropTypes.shape({
            data: PropTypes.arrayOf(PropTypes.socialTradingProvider),
            error: PropTypes.shape({
              error: PropTypes.string,
            }),
          }),
        }),
      }),
    }),
  };

  static defaultProps = {
    getSocialTradingProviders: {},
  };

  renderProviderColumn = ({ name, id, status }) => (
    <div className="ProvidersGrid__provider">
      <div className="ProvidersGrid__provider-name">{name}</div>
      <div className="ProvidersGrid__provider-id">
        {I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.COLUMNS.ID')}: {id}
      </div>
      <div className="ProvidersGrid__provider-status">
        {I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.COLUMNS.STATUS')}: {status}
      </div>
    </div>
  );

  renderSummaryAndDescriptionColumn = ({ summary, description }) => (
    <Choose>
      <When condition={!summary && !description}>
        <span>&mdash;</span>
      </When>
      <Otherwise>
        <div>
          <div className="ProvidersGrid__summary">{summary}</div>
          <div className="ProvidersGrid__description">{description}</div>
        </div>
      </Otherwise>
    </Choose>
  );

  renderStatusesColumn = ({ isPublic, isActive }) => (
    <div className="ProvidersGrid__statuses">
      <Choose>
        <When condition={isPublic}>
          <div className="ProvidersGrid__status ProvidersGrid__status--public">
            {I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.COLUMNS.PUBLIC')}
          </div>
        </When>
        <Otherwise>
          <div className="ProvidersGrid__status ProvidersGrid__status--private">
            {I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.COLUMNS.PRIVATE')}
          </div>
        </Otherwise>
      </Choose>

      <Choose>
        <When condition={isActive}>
          <div className="ProvidersGrid__status ProvidersGrid__status--active">
            {I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.COLUMNS.ACTIVE')}
          </div>
        </When>
        <Otherwise>
          <div className="ProvidersGrid__status ProvidersGrid__status--disabled">
            {I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.COLUMNS.DISABLED')}
          </div>
        </Otherwise>
      </Choose>
    </div>
  )

  renderDashOrData = data => (
    <div>{data || '—'}</div>
  );

  render() {
    const {
      handleRowClick,
      getSocialTradingProviders,
      getSocialTradingProviders: { loading },
    } = this.props;

    const providers = get(getSocialTradingProviders, 'data.socialTrading.providers.data') || [];

    return (
      <div className="ProvidersGrid__grid">
        <div className="ProvidersGrid__grid-header">{I18n.t('SOCIAL_TRADING.PROVIDERS.TITLE')}</div>
        <Grid
          data={providers}
          handleRowClick={handleRowClick}
          isLoading={loading}
          withNoResults={providers.length === 0}
        >
          <GridColumn
            name="provider"
            header={I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.HEADERS.PROVIDER')}
            render={this.renderProviderColumn}
          />

          <GridColumn
            name="minJoinBalance"
            header={I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.HEADERS.MIN_JOIN_BALANCE')}
            render={data => this.renderDashOrData(data.joinMinBalance)}
          />

          <GridColumn
            name="performanceFee"
            header={I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.HEADERS.PERFORMANCE_FEE')}
            render={data => this.renderDashOrData(data.performanceFee)}
          />

          <GridColumn
            name="feeReciever"
            header={I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.HEADERS.FEE_RECEIVER')}
            render={data => this.renderDashOrData(data.feeReceiver)}
          />

          <GridColumn
            name="companyFee"
            header={I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.HEADERS.COMPANY_FEE')}
            render={data => this.renderDashOrData(data.companyFee)}
          />

          <GridColumn
            name="currency"
            header={I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.HEADERS.CURRENCY')}
            render={data => this.renderDashOrData(data.currency)}
          />

          <GridColumn
            name="description"
            header={I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.HEADERS.DESCRIPTION')}
            render={this.renderSummaryAndDescriptionColumn}
          />

          <GridColumn
            name="statuses"
            header={I18n.t('SOCIAL_TRADING.PROVIDERS.GRID.HEADERS.STATUSES')}
            render={this.renderStatusesColumn}
          />
        </Grid>
      </div>
    );
  }
}

export default compose(
  withRequests({
    getSocialTradingProviders: getSocialTradingProvidersQuery,
  }),
)(ProvidersGrid);
