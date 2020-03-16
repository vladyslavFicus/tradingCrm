import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { get } from 'lodash';
import I18n from 'i18n-js';
import moment from 'moment';
import PropTypes from 'constants/propTypes';
import Grid, { GridColumn } from 'components/Grid';
import getSocialTradingSubscribersQuery from './graphql/getSocialTradingSubscribersQuery';
import './SubscribersGrid.scss';

class SubscribersGrid extends PureComponent {
  static propTypes = {
    getSocialTradingSubscribers: PropTypes.shape({
      loading: PropTypes.bool,
      data: PropTypes.shape({
        socialTrading: PropTypes.shape({
          subscribers: PropTypes.shape({
            data: PropTypes.arrayOf(PropTypes.socialTradingSubscriber),
            error: PropTypes.shape({
              error: PropTypes.string,
            }),
          }),
        }),
      }),
    }),
  };

  static defaultProps = {
    getSocialTradingSubscribers: {},
  };

  renderSubscriberColumn = ({ subscriberId, status }) => (
    <div className="SubscribersGrid__subscriber">
      <div className="SubscribersGrid__subscriber-id">
        {I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.COLUMNS.ID')}: {subscriberId}
      </div>
      <div className="SubscribersGrid__subscriber-status">
        {I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.COLUMNS.STATUS')}: {status}
      </div>
    </div>
  );

  renderProviderColumn = ({ sourceId, sourceName }) => (
    <div className="SubscribersGrid__provider">
      <div className="SubscribersGrid__provider-name">{sourceName}</div>
      <div className="SubscribersGrid__provider-id">
        {I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.COLUMNS.ID')}: {sourceId}
      </div>
    </div>
  );

  renderPriceModeColumn = ({ priceMode }) => (
    <div>{priceMode}</div>
  );

  renderSharingColumn = ({ shareAction: { typeSharing, reverse } }) => (
    <div>
      <div>{typeSharing}</div>
      <If condition={reverse}>
        <div>{I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.COLUMNS.REVERSE')}</div>
      </If>
    </div>
  );

  renderMinMaxLotColumn = ({ minimumLot, maximumLot }) => (
    <div>{minimumLot || '—'} / {maximumLot || '—'}</div>
  );

  renderNumberOrSlash = (number, className) => (
    <div className={className}>{number || '—'}</div>
  );

  renderDateTime = date => (
    <div>
      <div className="SubscribersGrid__date">
        {moment(date).format('DD.MM.YYYY')}
      </div>
      <div className="SubscribersGrid__time">
        {moment(date).format('HH:mm:ss')}
      </div>
    </div>
  );

  renderArchievedColumn = ({ isArchive }) => (
    <If condition={isArchive}>
      <div className="SubscribersGrid__archieved">
        {I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.COLUMNS.ARCHIEVED')}
      </div>
    </If>
  );

  render() {
    const {
      getSocialTradingSubscribers,
      getSocialTradingSubscribers: { loading },
    } = this.props;

    const subscribers = get(getSocialTradingSubscribers, 'data.socialTrading.subscribers.data') || [];

    return (
      <div className="SubscribersGrid__grid">
        <div className="SubscribersGrid__grid-header">{I18n.t('SOCIAL_TRADING.SUBSCRIBERS.TITLE')}</div>
        <Grid
          data={subscribers}
          isLoading={loading}
          withNoResults={subscribers.length === 0}
        >
          <GridColumn
            name="subscriber"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.HEADERS.SUBSCRIBER')}
            render={this.renderSubscriberColumn}
          />

          <GridColumn
            name="provider"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.HEADERS.PROVIDER')}
            render={this.renderProviderColumn}
          />

          <GridColumn
            name="symbols"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.HEADERS.SYMBOLS')}
            render={data => this.renderNumberOrSlash(data.symbols, 'SubscribersGrid__symbol')}
          />

          <GridColumn
            name="priceMode"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.HEADERS.PRICE_MODE')}
            render={this.renderPriceModeColumn}
          />

          <GridColumn
            name="performanceFee"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.HEADERS.PERFORMANCE_FEE')}
            render={data => this.renderNumberOrSlash(data.totalPerformanceFee)}
          />

          <GridColumn
            name="sharing"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.HEADERS.SHARING')}
            render={this.renderSharingColumn}
          />

          <GridColumn
            name="multiplicator"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.HEADERS.MULTIPLICATOR')}
            render={data => this.renderNumberOrSlash(data.shareAction.multiplicator)}
          />

          <GridColumn
            name="profit"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.HEADERS.PROFIT')}
            render={data => this.renderNumberOrSlash(data.takeProfit)}
          />

          <GridColumn
            name="stopLoss"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.HEADERS.STOP_LOSS')}
            render={data => this.renderNumberOrSlash(data.stopLoss)}
          />

          <GridColumn
            name="minMaxLot"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.HEADERS.MIN_MAX_LOT')}
            render={this.renderMinMaxLotColumn}
          />

          <GridColumn
            name="maxDeviation"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.HEADERS.MAX_DEVIATION')}
            render={data => this.renderNumberOrSlash(data.maxDeviation)}
          />

          <GridColumn
            name="created"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.HEADERS.CREATED')}
            render={data => this.renderDateTime(data.created)}
          />

          <GridColumn
            name="updated"
            header={I18n.t('SOCIAL_TRADING.SUBSCRIBERS.GRID.HEADERS.UPDATED')}
            render={data => this.renderDateTime(data.updated)}
          />

          <GridColumn
            name="archieved"
            render={this.renderArchievedColumn}
          />
        </Grid>
      </div>
    );
  }
}

export default compose(
  withRequests({
    getSocialTradingSubscribers: getSocialTradingSubscribersQuery,
  }),
)(SubscribersGrid);
