
import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import classNames from 'classnames';
import { withStreams } from 'rsocket';
import { useAccountStatisticQuery, AccountStatisticQuery } from './graphql/__generated__/AccountStatisticQuery';
import './AccountProfileStatistics.scss';

type Props = {
  uuid: string
  statistic$: {
    data: {
      depositsSum: number;
      credit: number;
      balance: number;
      margin: number;
      freeMargin: number;
      marginLevel: number;
      equity: number;
      openPnL: number;
    },
  },
};
type AccountStatistic = AccountStatisticQuery['tradingEngine']['accountStatistic'];

const AccountProfileStatistics = (props: Props) => {
  const { uuid } = props;
  const statisticQuery = useAccountStatisticQuery({
    variables: { accountUuid: uuid },
    skip: !uuid,
    fetchPolicy: 'network-only',
  });

  const statistic = statisticQuery.data?.tradingEngine.accountStatistic || {} as AccountStatistic;
  const statistic$ = props.statistic$?.data;

  const depositsSum = Number(statistic.depositsSum).toFixed(2);
  const withdrawalsSum = Number(statistic.withdrawalsSum).toFixed(2);
  const credit = Number(statistic?.credit).toFixed(2);
  const balance = Number(statistic?.balance).toFixed(2);
  const equity = Number(statistic$?.equity ?? statistic.equity).toFixed(2);
  const margin = Number(statistic$?.margin ?? statistic.margin).toFixed(2);
  const freeMargin = Number(statistic$?.freeMargin ?? statistic.freeMargin).toFixed(2);
  const marginLevel = Number((statistic$?.marginLevel ?? statistic.marginLevel) * 100).toFixed(2);
  const openPnL = Number(statistic$?.openPnL ?? statistic.openPnl).toFixed(2);

  return (
    <div className="AccountProfileStatistics">
      <div className="AccountProfileStatistics__statistics-block">
        <div className="AccountProfileStatistics__statistics">
          <div>
            <strong>
              {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.DEPOSIT')}:&nbsp;
            </strong>
            <span className={classNames({
              'AccountProfileStatistics__value--positive': Number(depositsSum) > 0,
            })}
            >
              {depositsSum !== 'NaN' ? depositsSum : '...'}
            </span>
          </div>
          <div>
            <strong>
              {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.WITHDRAW')}:&nbsp;
            </strong>
            <span className={classNames({
              'AccountProfileStatistics__value--negative': Number(withdrawalsSum) < 0,
            })}
            >
              {withdrawalsSum !== 'NaN' ? withdrawalsSum : '...'}
            </span>
          </div>
        </div>

        <div className="AccountProfileStatistics__divider" />

        <div className="AccountProfileStatistics__statistics">
          <div>
            <strong>
              {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.BALANCE')}:&nbsp;
            </strong>
            <span className={classNames({
              'AccountProfileStatistics__value--positive': Number(balance) > 0,
              'AccountProfileStatistics__value--negative': Number(balance) < 0,
            })}
            >
              {balance !== 'NaN' ? balance : '...'}
            </span>
          </div>
          <div>
            <strong>
              {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.CREDIT')}:&nbsp;
            </strong>
            <span className={classNames({
              'AccountProfileStatistics__value--positive': Number(credit) > 0,
            })}
            >
              {credit !== 'NaN' ? credit : '...'}
            </span>
          </div>
        </div>

        <div className="AccountProfileStatistics__divider" />

        <div className="AccountProfileStatistics__statistics">
          <div>
            <strong>
              {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.EQUITY')}:&nbsp;
            </strong>
            <span>{equity !== 'NaN' ? equity : '...'}</span>
          </div>
          <div>
            <strong>
              {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.MARGIN')}:&nbsp;
            </strong>
            <span>{margin !== 'NaN' ? margin : '...'}</span>
          </div>
        </div>

        <div className="AccountProfileStatistics__divider" />

        <div className="AccountProfileStatistics__statistics">
          <div>
            <strong>
              {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.FREE_MARGIN')}:&nbsp;
            </strong>
            <span>{freeMargin !== 'NaN' ? freeMargin : '...'}</span>
          </div>
          <div>
            <strong>
              {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.MARGIN_LEVEL')}:&nbsp;
            </strong>
            <span>
              {marginLevel !== 'NaN' ? `${marginLevel}%` : '...'}
            </span>
          </div>
        </div>

        <div className="AccountProfileStatistics__divider" />

        <div className="AccountProfileStatistics__statistics">
          <div>
            <strong>
              {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.OPEN_PnL')}:&nbsp;
            </strong>
            <span className={classNames({
              'AccountProfileStatistics__value--positive': Number(openPnL) > 0,
              'AccountProfileStatistics__value--negative': Number(openPnL) < 0,
            })}
            >
              {openPnL !== 'NaN' ? openPnL : '...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default compose(
  React.memo,
  withStreams(({ uuid }: { uuid: string }) => ({
    statistic$: {
      route: 'streamAccountStatistics',
      data: { accountUuid: uuid },
      skip: !uuid,
    },
  })),
)(AccountProfileStatistics);