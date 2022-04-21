import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import { Sort, State } from 'types';
import { types } from '../../attributes/constants';
import { getTypeColor } from '../../attributes/utils';
import AccountProfileTransactionsGridFilter from './components/AccountProfileTransactionsGridFilter';
import { TransactionsQueryVariables, useTransactionsQuery } from './graphql/__generated__/TransactionsQuery';
import './AccountProfileTransactionsGrid.scss';

const AccountProfileTransactionsGrid = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation<State<TransactionsQueryVariables['args']>>();

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

  const { content = [], last = true, totalElements } = transactionsQuery.data?.tradingEngine.transactions || {};

  const handlePageChanged = () => {
    const { data, variables, fetchMore } = transactionsQuery;
    const page = data?.tradingEngine.transactions.number || 0;

    fetchMore({ variables: set(cloneDeep(variables as TransactionsQueryVariables), 'args.page.from', page + 1) });
  };

  const handleSort = (sorts: Sort[]) => {
    history.replace({
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
                  getTypeColor(types.find(item => item.value === type)?.value || ''),
                  'AccountProfileTransactionsGrid__cell-value',
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
