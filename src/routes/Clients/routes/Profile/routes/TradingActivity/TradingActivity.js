import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import EventEmitter, { PROFILE_RELOAD } from 'utils/EventEmitter';
import PropTypes from 'constants/propTypes';
import Grid, { GridColumn } from 'components/Grid';
import Badge from 'components/Badge';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/UI';
import ChangeOriginalAgentModal from './components/ChangeOriginalAgentModal';
import FilterFields from './components/FilterFields';
import TradingActivityQuery from './graphql/TradingActivityQuery';
import { tradeStatusesColor, types } from './attributes/constants';
import { getTypeColor } from './attributes/utils';

class TradingActivity extends PureComponent {
  static propTypes = {
    tradingActivityQuery: PropTypes.query({
      clientTradingActivity: PropTypes.pageable(PropTypes.tradingActivity),
    }).isRequired,
    modals: PropTypes.shape({
      changeOriginalAgentModal: PropTypes.modalType,
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.onProfileEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.onProfileEvent);
  }

  onProfileEvent = () => {
    this.props.tradingActivityQuery.refetch();
  };

  handlePageChanged = () => {
    const {
      tradingActivityQuery: {
        data,
        loadMore,
      },
    } = this.props;

    const page = get(data, 'tradingActivityQuery.data.number') || 0;

    loadMore(page + 1);
  };

  showChangeOriginalAgentModal = (tradeId, agentId, platformType) => {
    const { tradingActivityQuery, modals: { changeOriginalAgentModal } } = this.props;

    changeOriginalAgentModal.show({
      tradeId,
      agentId,
      platformType,
      onSuccess: tradingActivityQuery.refetch,
    });
  }

  render() {
    const {
      tradingActivityQuery: {
        data,
        loading,
      },
    } = this.props;

    const { content, last } = get(data, 'clientTradingActivity.data') || { content: [] };
    const error = get(data, 'clientTradingActivity.error');

    return (
      <Fragment>
        <TabHeader title={I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.TRADING_ACTIVITY')} />
        <FilterFields />
        <div className="tab-wrapper">
          <Grid
            data={content}
            handlePageChanged={this.handlePageChanged}
            isLoading={loading}
            isLastPage={last}
            withNoResults={error}
          >
            <GridColumn
              header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.TRADE')}
              render={({ tradeId, tradeType, originalAgent, platformType }) => (
                <Fragment>
                  <Badge
                    text={I18n.t(`CONSTANTS.ACCOUNT_TYPE.${tradeType}`)}
                    info={tradeType === 'DEMO'}
                    success={tradeType === 'LIVE'}
                  >
                    <Button
                      className="btn-transparent-text font-weight-700"
                      onClick={() => (
                        this.showChangeOriginalAgentModal(tradeId, originalAgent && originalAgent.uuid, platformType)
                      )}
                    >
                      TR-{tradeId}
                    </Button>
                  </Badge>
                  <div className="font-size-11">
                    <Uuid
                      uuid={`${tradeId}`}
                      uuidPrefix="TR"
                    />
                  </div>
                </Fragment>
              )}
            />
            <GridColumn
              header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.TYPE')}
              render={({ operationType }) => (
                <div
                  className={classNames(
                    getTypeColor(types.find(item => item.value === operationType).value),
                    'font-weight-700',
                  )}
                >
                  {I18n.t(types.find(item => item.value === operationType).label)}
                </div>
              )}
            />
            <GridColumn
              header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.TRADING_ACC')}
              render={({ login, symbol, platformType }) => (
                <Fragment>
                  <PlatformTypeBadge platformType={platformType}>
                    <div className="font-weight-700">{login}</div>
                  </PlatformTypeBadge>
                  <div className="font-size-11">{symbol}</div>
                </Fragment>
              )}
            />
            <GridColumn
              header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.ORIGINAL_AGENT')}
              render={({ originalAgent }) => (
                <Choose>
                  <When condition={originalAgent}>
                    <div className="font-weight-700">
                      {originalAgent.fullName}
                    </div>
                    <div className="font-size-11">
                      <Uuid uuid={originalAgent.uuid} />
                    </div>
                  </When>
                  <Otherwise>
                    <div>&mdash;</div>
                  </Otherwise>
                </Choose>
              )}
            />
            <GridColumn
              header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.OPEN_PRICE')}
              render={({ openPrice, stopLoss, takeProfit }) => (
                <Fragment>
                  <div className="font-weight-700">{openPrice}</div>
                  <If condition={stopLoss}>
                    <div className="font-size-11">
                      S/L {parseFloat(stopLoss).toLocaleString('en-EN', { minimumFractionDigits: 5 })}
                    </div>
                  </If>
                  <If condition={takeProfit}>
                    <div className="font-size-11">
                      T/P {parseFloat(takeProfit).toLocaleString('en-EN', { minimumFractionDigits: 5 })}
                    </div>
                  </If>
                </Fragment>
              )}
            />
            <GridColumn
              header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.CLOSE_PRICE')}
              render={({ closePrice, closeTime }) => (
                <div className="font-weight-700">{closeTime ? closePrice : '-'}</div>
              )}
            />
            <GridColumn
              header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.VOLUME')}
              render={({ volume }) => (
                <div className="font-weight-700">{volume}</div>
              )}
            />
            <GridColumn
              header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.COMISSION')}
              render={({ commission }) => (
                <div className="font-weight-700">{Number(commission).toFixed(2)}</div>
              )}
            />
            <GridColumn
              header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.SWAP')}
              render={({ swap }) => (
                <div className="font-weight-700">{swap}</div>
              )}
            />
            <GridColumn
              header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.P&L')}
              render={({ profit }) => (
                <div className="font-weight-700">{profit}</div>
              )}
            />
            <GridColumn
              header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.OPEN_TIME')}
              render={({ openTime }) => (
                <Fragment>
                  <div className="font-weight-700">{moment(moment.unix(openTime)).format('DD.MM.YYYY')}</div>
                  <div className="font-size-11">{moment(moment.unix(openTime)).format('HH:mm:ss')}</div>
                </Fragment>
              )}
            />
            <GridColumn
              header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.CLOSE_TIME')}
              render={({ closeTime }) => (
                <Fragment>
                  <div className="font-weight-700">
                    <Choose>
                      <When condition={closeTime}>
                        {moment(moment.unix(closeTime)).format('DD.MM.YYYY')}
                      </When>
                      <Otherwise>
                        <span>&mdash;</span>
                      </Otherwise>
                    </Choose>
                  </div>
                  <If condition={closeTime}>
                    <div className="font-size-11">{moment(moment.unix(closeTime)).format('HH:mm:ss')}</div>
                  </If>
                </Fragment>
              )}
            />
            <GridColumn
              header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.STATUS')}
              render={({ tradeStatus }) => (
                <div
                  className={classNames(
                    tradeStatusesColor[`${tradeStatus}`],
                    'font-weight-700 text-uppercase',
                  )}
                >
                  {I18n.t(`CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUSES.${tradeStatus}`)}
                </div>
              )}
            />
          </Grid>
        </div>
      </Fragment>
    );
  }
}
export default compose(
  withModals({
    changeOriginalAgentModal: ChangeOriginalAgentModal,
  }),
  withRequests({
    tradingActivityQuery: TradingActivityQuery,
  }),
)(TradingActivity);
