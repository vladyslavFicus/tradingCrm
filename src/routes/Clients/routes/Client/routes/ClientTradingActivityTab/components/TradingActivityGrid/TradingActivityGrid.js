import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import Grid, { GridColumn } from 'components/Grid';
import Badge from 'components/Badge';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import { tradeStatusesColor, types } from '../../attributes/constants';
import { getTypeColor } from '../../attributes/utils';
import ChangeOriginalAgentModal from '../ChangeOriginalAgentModal';

class TradingActivityGrid extends PureComponent {
  static propTypes = {
    tradingActivityQuery: PropTypes.query({
      tradingActivity: PropTypes.pageable(PropTypes.tradingActivity),
    }).isRequired,
    modals: PropTypes.shape({
      changeOriginalAgentModal: PropTypes.modalType,
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      tradingActivityQuery: {
        data,
        loadMore,
      },
    } = this.props;

    const page = get(data, 'tradingActivity.number') || 0;

    loadMore(page + 1);
  };

  showChangeOriginalAgentModal = (tradeId, originalAgent, platformType) => {
    const { tradingActivityQuery, modals: { changeOriginalAgentModal } } = this.props;

    changeOriginalAgentModal.show({
      tradeId,
      originalAgent,
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

    const { content, last } = get(data, 'tradingActivity') || { content: [] };

    return (
      <div className="tab-wrapper">
        <Grid
          data={content}
          handlePageChanged={this.handlePageChanged}
          headerStickyFromTop={189}
          isLoading={loading}
          isLastPage={last}
          withNoResults={!loading && !content.length}
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
                  <div
                    className="btn-transparent-text font-weight-700 cursor-pointer"
                    onClick={() => (
                      this.showChangeOriginalAgentModal(tradeId, originalAgent, platformType)
                    )}
                  >
                    TR-{tradeId}
                  </div>
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
    );
  }
}

export default withModals({
  changeOriginalAgentModal: ChangeOriginalAgentModal,
})(TradingActivityGrid);