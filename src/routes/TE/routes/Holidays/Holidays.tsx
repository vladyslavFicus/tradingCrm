import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import { State, Sort } from 'types';
import { tradingEngineTabs } from '../../constants';
import HolidaysFilter from './components/HolidaysFilter';
import { useHolidaysQuery, HolidaysQuery, HolidaysQueryVariables } from './graphql/__generated__/HolidaysQuery';
import './Holidays.scss';

type Holiday = ExtractApolloTypeFromPageable<HolidaysQuery['tradingEngine']['holidays']>;

const Holidays = () => {
  const history = useHistory();
  const { state } = useLocation<State<HolidaysQueryVariables['args']>>();

  const holidaysQuery = useHolidaysQuery({
    variables: {
      args: {
        ...state?.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
  });

  const { content = [], last = true, totalElements } = holidaysQuery.data?.tradingEngine.holidays || {};

  const handlePageChanged = () => {
    const { data, variables, fetchMore } = holidaysQuery;

    const page = data?.tradingEngine.holidays.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables as HolidaysQueryVariables), 'args.page.from', page + 1),
    });
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
    <div className="Holidays">
      <Tabs items={tradingEngineTabs} />

      <div className="Holidays__header">
        <span>
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.HOLIDAYS.HEADLINE')}
        </span>
      </div>

      <HolidaysFilter onRefresh={holidaysQuery.refetch} />

      <Table
        items={content}
        loading={holidaysQuery.loading}
        hasMore={!last}
        sorts={state?.sorts}
        onSort={handleSort}
        onMore={handlePageChanged}
        stickyFromTop={127}
      >
        <Column
          sortBy="date"
          header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.DAY')}
          render={({ date }: Holiday) => (
            <div className="Holidays__cell-value">
              {moment(date).format('YYYY.MM.DD')}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.FROM')}
          render={({ timeRange: { from } }: Holiday) => (
            <div className="Holidays__cell-value">
              {from}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.TO')}
          render={({ timeRange: { to } }: Holiday) => (
            <div className="Holidays__cell-value">
              {to}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.DESCRIPTION')}
          render={({ description }: Holiday) => (
            <div className="Holidays__cell-value">
              {description}
            </div>
          )}
        />
      </Table>
    </div>
  );
};

export default React.memo(Holidays);
