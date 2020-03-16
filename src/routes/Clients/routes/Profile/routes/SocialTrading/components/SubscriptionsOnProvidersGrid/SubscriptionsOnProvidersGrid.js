import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import Grid, { GridColumn } from 'components/Grid';
import getSocialTradingSubscriptionsOnProvidersQuery from './graphql/getSocialTradingSubscriptionsOnProvidersQuery';
import './SubscriptionsOnProvidersGrid.scss';

class SubscriptionsOnProvidersGrid extends PureComponent {
  static propTypes = {
    getSocialTradingSubscriptionsOnProviders: PropTypes.shape({
      loading: PropTypes.bool,
      data: PropTypes.shape({
        socialTrading: PropTypes.shape({
          subscriptionsOnProviders: PropTypes.shape({
            data: PropTypes.arrayOf(PropTypes.socialTradingSubscriptionOnProvider),
            error: PropTypes.shape({
              error: PropTypes.string,
            }),
          }),
        }),
      }),
    }),
  };

  static defaultProps = {
    getSocialTradingSubscriptionsOnProviders: {},
  };

  renderSubscriptionColumn = ({ subscriberId, subscriberName }) => (
    <div className="SubscriptionsOnProviderGrid__subscriber">
      <div className="SubscriptionsOnProviderGrid__subscriber-name">{subscriberName}</div>
      <div className="SubscriptionsOnProviderGrid__subscriber-id">
        {I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.COLUMNS.ID')}: {subscriberId}
      </div>
    </div>
  );

  renderProviderColumn = ({ sourceId, sourceName }) => (
    <div className="SubscriptionsOnProviderGrid__provider">
      <div className="SubscriptionsOnProviderGrid__provider-name">{sourceName}</div>
      <div className="SubscriptionsOnProviderGrid__provider-id">
        {I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.COLUMNS.ID')}: {sourceId}
      </div>
    </div>
  );

  renderSharingTypeColumn = ({ shareAction: { typeSharing } }) => (
    <div>{typeSharing}</div>
  );

  renderReverseColumn = ({ shareAction: { reverse } }) => (
    <div>{Boolean(reverse).toString().toUpperCase()}</div>
  );

  render() {
    const {
      getSocialTradingSubscriptionsOnProviders,
      getSocialTradingSubscriptionsOnProviders: { loading },
    } = this.props;

    const subscriptionsOnProviders = get(
      getSocialTradingSubscriptionsOnProviders, 'data.socialTrading.subscriptionsOnProviders.data',
    ) || [];

    return (
      <div className="SubscriptionsOnProviderGrid__grid">
        <div className="SubscriptionsOnProviderGrid__grid-header">
          {I18n.t('SOCIAL_TRADING.SUBSCRIPTION_ON_PROVIDER.TITLE')}
        </div>

        <Grid
          data={subscriptionsOnProviders}
          isLoading={loading}
          withNoResults={subscriptionsOnProviders.length === 0}
        >
          <GridColumn
            name="subscription"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIPTION_ON_PROVIDER.GRID.HEADERS.SUBSCRIPTION')}
            render={this.renderSubscriptionColumn}
          />

          <GridColumn
            name="provider"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIPTION_ON_PROVIDER.GRID.HEADERS.PROVIDER')}
            render={this.renderProviderColumn}
          />

          <GridColumn
            name="sharingType"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIPTION_ON_PROVIDER.GRID.HEADERS.SHARING_TYPE')}
            render={this.renderSharingTypeColumn}
          />

          <GridColumn
            name="reverse"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIPTION_ON_PROVIDER.GRID.HEADERS.REVERSE')}
            render={this.renderReverseColumn}
          />
        </Grid>
      </div>
    );
  }
}

export default compose(
  withRequests({
    getSocialTradingSubscriptionsOnProviders: getSocialTradingSubscriptionsOnProvidersQuery,
  }),
)(SubscriptionsOnProvidersGrid);
