import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { State, Sort } from 'types';
import permissions from 'config/permissions';
import { Table, Column } from 'components/Table';
import PermissionContent from 'components/PermissionContent';
import { Button } from 'components/UI';
import Tabs from 'components/Tabs';
import { tradingEngineTabs } from 'routes/TE/constants';
import HolidaysFilter from './components/HolidaysFilter';
import { useHolidaysQuery, HolidaysQuery, HolidaysQueryVariables } from './graphql/__generated__/HolidaysQuery';
import './HolidaysList.scss';

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

  const handleCreateClick = () => {
    history.push('/trading-engine/holidays/new');
  };

  return (
    <div className="HolidaysList">
      <Tabs items={tradingEngineTabs} />

      <div className="HolidaysList__header">
        <div>
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.HOLIDAYS.HEADLINE')}
        </div>

        <PermissionContent permissions={permissions.WE_TRADING.HOLIDAYS_CREATE}>
          <div>
            <Button
              onClick={handleCreateClick}
              commonOutline
              small
            >
              {I18n.t('TRADING_ENGINE.HOLIDAYS.NEW_HOLIDAY')}
            </Button>
          </div>
        </PermissionContent>
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
            <div className="HolidaysList__cell-value">
              {moment(date).format('YYYY.MM.DD')}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.FROM')}
          render={({ timeRange: { from } }: Holiday) => (
            <div className="HolidaysList__cell-value">
              {from}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.TO')}
          render={({ timeRange: { to } }: Holiday) => (
            <div className="HolidaysList__cell-value">
              {to}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.HOLIDAYS.GRID.DESCRIPTION')}
          render={({ description }: Holiday) => (
            <div className="HolidaysList__cell-value">
              {description}
            </div>
          )}
        />
      </Table>
    </div>
  );
};

export default React.memo(Holidays);
