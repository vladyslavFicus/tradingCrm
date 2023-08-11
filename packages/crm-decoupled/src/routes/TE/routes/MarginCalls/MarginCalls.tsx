import React from 'react';
import I18n from 'i18n-js';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Types, Constants } from '@crm/common';
import {
  TradingEngine__AccountTypes__Enum as AccountTypes,
  TradingEngine__OrderStatuses__Enum as OrderStatus,
} from '__generated__/types';
import Badge from 'components/Badge';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import Uuid from 'components/Uuid';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import { tradingEngineTabs } from '../../constants';
import MarginCallsFilter from './components/MarginCallsFilter';
import { AccountsQueryVariables, useAccountsQuery, AccountsQuery } from './graphql/__generated__/AccountsQuery';
import './MarginCalls.scss';

const DEFAULT_SORTING = [{ column: 'marginLevel', direction: 'ASC' }];

type Account = ExtractApolloTypeFromPageable<AccountsQuery['tradingEngine']['accounts']>;

const MarginCalls = () => {
  const state = useLocation().state as Types.State<AccountsQueryVariables['args']>;
  const navigate = useNavigate();

  const sorts = (state?.sorts && state?.sorts.length > 0) ? state.sorts : DEFAULT_SORTING;

  const accountsQuery = useAccountsQuery({
    variables: {
      args: {
        orderStatuses: [OrderStatus.OPEN],
        ...state?.filters,
        page: {
          from: 0,
          size: 20,
          sorts,
        },
      },
    },
  });

  const { data } = accountsQuery;
  const page = data?.tradingEngine.accounts.number || 0;
  const { content = [], last = true } = data?.tradingEngine.accounts || {};

  const handlePageChanged = useHandlePageChanged({ query: accountsQuery, page, path: 'page.from' });

  const handleSort = (_sorts: Types.Sort[]) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts: _sorts,
      },
    });
  };

  return (
    <div className="MarginCalls">
      <Tabs items={tradingEngineTabs} />

      <div className="MarginCalls__header">
        <span>
          {I18n.t('TRADING_ENGINE.MARGIN_CALLS.HEADLINE')}
        </span>
      </div>

      <MarginCallsFilter onRefresh={accountsQuery.refetch} />

      <div className="Accounts">
        <Table
          stickyFromTop={125}
          items={content}
          sorts={sorts}
          loading={accountsQuery.loading}
          hasMore={!last}
          onMore={handlePageChanged}
          onSort={handleSort}
          customClassNameRow={({ groupEntity: { marginCallLevel }, marginLevel }: Account) => (
            classNames({
              'MarginCalls__row MarginCalls__row--in-margin-call':
                Number((marginLevel * 100).toFixed(2)) <= marginCallLevel,
            })
          )}
        >
          <Column
            header={I18n.t('TRADING_ENGINE.MARGIN_CALLS.GRID.LOGIN')}
            render={({ login, group, uuid }: Account) => (
              <Link to={`/trading-engine/accounts/${uuid}`} target="_blank">
                <div className="MarginCalls__text-primary">
                  {login}
                </div>
                <div className="MarginCalls__text-secondary">
                  {group}
                </div>
              </Link>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.MARGIN_CALLS.GRID.TRADING_ACC')}
            render={({ uuid, name, accountType }: Account) => (
              <>
                <Badge
                  text={I18n.t(Constants.accountTypesLabels[accountType].label)}
                  info={accountType === AccountTypes.DEMO}
                  success={accountType === AccountTypes.LIVE}
                >
                  <div className="MarginCalls__text-primary">
                    {name}
                  </div>
                </Badge>
                <div className="MarginCalls__text-secondary">
                  <Uuid uuid={uuid} uuidPrefix="TE" />
                </div>
              </>
            )}
          />
          <Column
            sortBy="marginLevel"
            header={I18n.t('TRADING_ENGINE.MARGIN_CALLS.GRID.MARGIN_LEVEL')}
            render={({ marginLevel }: Account) => (
              <div className="MarginCalls__text-primary">{(marginLevel * 100).toFixed(2)}%</div>
            )}
          />
        </Table>
      </div>
    </div>
  );
};

export default React.memo(MarginCalls);
