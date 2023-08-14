import React, { useEffect } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Utils, Types } from '@crm/common';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import { types } from '../../attributes/constants';
import AccountProfileTransactionsGridFilter from './components/AccountProfileTransactionsGridFilter';
import { TransactionsQueryVariables, useTransactionsQuery } from './graphql/__generated__/TransactionsQuery';
import './AccountProfileTransactionsGrid.scss';

const AccountProfileTransactionsGrid = () => {
  const navigate = useNavigate();
  const id = useParams().id as string;
  const state = useLocation().state as Types.State<TransactionsQueryVariables['args']>;

  const transactionsQuery = useTransactionsQuery({
    variables: {
      args: {
        accountUuid: id,
        ...state?.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
  });

  const { data } = transactionsQuery;
  const { content = [], last = true, totalElements } = data?.tradingEngine.transactions || {};
  const page = data?.tradingEngine.transactions.number || 0;

  useEffect(() => {
    Utils.EventEmitter.on(Utils.TRANSACTION_CREATED, transactionsQuery.refetch);

    return () => {
      Utils.EventEmitter.off(Utils.TRANSACTION_CREATED, transactionsQuery.refetch);
    };
  }, []);

  const handlePageChanged = useHandlePageChanged({
    query: transactionsQuery,
    page,
    path: 'page.from',
  });

  const handleSort = (sorts: Types.Sort[]) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  };

  return (
    <div className="AccountProfileTransactionsGrid">
      <div className="AccountProfileTransactionsGrid__title">
        <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.TRANSACTIONS.HEADLINE')}
      </div>

      <AccountProfileTransactionsGridFilter handleRefetch={transactionsQuery.refetch} />

      <div>
        <Table
          stickyFromTop={124}
          items={content}
          loading={transactionsQuery.loading}
          hasMore={!last}
          sorts={state?.sorts}
          onSort={handleSort}
          onMore={handlePageChanged}
        >
          <Column
            sortBy="transaction"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.TRANSACTIONS.GRID.TRANSACTION')}
            render={({ id: transactionId }) => (
              <div className="AccountProfileTransactionsGrid__uuid">
                <div className="AccountProfileTransactionsGrid__cell-value">
                  TR-{transactionId}
                </div>
                <Uuid
                  uuid={transactionId}
                  title={I18n.t('COMMON.COPY')}
                  className="AccountProfileTransactionsGrid__cell-value-add"
                />
              </div>
            )}
          />
          <Column
            sortBy="type"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.TRANSACTIONS.GRID.TYPE')}
            render={({ type }) => (
              <div
                className={classNames(
                  'AccountProfileTransactionsGrid__cell-value',
                  'AccountProfileTransactionsGrid__type',
                )}
              >
                {I18n.t(types.find(item => item.value === type)?.label || '')}
              </div>
            )}
          />
          <Column
            sortBy="amount"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.TRANSACTIONS.GRID.AMOUNT')}
            render={({ amount }) => (
              <div className="AccountProfileTransactionsGrid__cell-value">{amount.toFixed(2)}</div>
            )}
          />
          <Column
            sortBy="time"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.TRANSACTIONS.GRID.TIME')}
            render={({ createdAt }) => (
              <div className="AccountProfileTransactionsGrid__cell-value">
                {moment.utc(createdAt).local().format('DD.MM.YYYY')}
              </div>
            )}
          />
        </Table>
      </div>
    </div>
  );
};

export default React.memo(AccountProfileTransactionsGrid);
