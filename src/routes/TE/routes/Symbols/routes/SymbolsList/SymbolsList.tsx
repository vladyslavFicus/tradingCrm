import React from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { State, Sort } from 'types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import { Button } from 'components/UI';
import { Link } from 'components/Link';
import PermissionContent from 'components/PermissionContent';
import Badge from 'components/Badge';
import { tradingEngineTabs } from 'routes/TE/constants';
import SymbolsFilter from './components/SymbolsFilter';
import { useSymbolsQuery, SymbolsQueryVariables } from './graphql/__generated__/SymbolsQuery';
import './SymbolsList.scss';

const SymbolsList = () => {
  const history = useHistory();
  const { state } = useLocation<State<SymbolsQueryVariables['args']>>();
  const permission = usePermission();

  const symbolsQuery = useSymbolsQuery({
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

  const { content = [], last = true, totalElements } = symbolsQuery.data?.tradingEngine.symbols || {};

  // ======= Handlers ======= //
  const handleSort = (sorts: Sort[]) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  const handlePageChanged = () => {
    const { data, variables, fetchMore } = symbolsQuery;

    const page = data?.tradingEngine.symbols.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables as SymbolsQueryVariables), 'args.page.from', page + 1),
    });
  };

  return (
    <div className="SymbolsList">
      <Tabs items={tradingEngineTabs} />

      <div className="SymbolsList__header">
        <span>
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.SYMBOLS.HEADLINE')}
        </span>

        <PermissionContent permissions={permissions.WE_TRADING.CREATE_SYMBOL}>
          <Link to="/trading-engine/symbols/new">
            <Button
              className="SymbolsList__action"
              commonOutline
              small
            >
              {I18n.t('TRADING_ENGINE.SYMBOLS.NEW_SYMBOL')}
            </Button>
          </Link>
        </PermissionContent>
      </div>

      <SymbolsFilter onRefresh={symbolsQuery.refetch} />

      <Table
        items={content}
        sorts={state?.sorts}
        loading={symbolsQuery.loading}
        hasMore={!last}
        onMore={handlePageChanged}
        onSort={handleSort}
        stickyFromTop={127}
      >
        <Column
          header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SYMBOL')}
          render={({ symbol, source }) => {
            const render = (
              <Choose>
                <When condition={permission.allows(permissions.WE_TRADING.EDIT_SYMBOL)}>
                  <Link to={`/trading-engine/symbols/${symbol}`} target="_blank">
                    <div className="SymbolsList__cell-primary">
                      {symbol}
                    </div>
                  </Link>
                </When>
                <Otherwise>
                  <div className="SymbolsList__cell-primary">
                    {symbol}
                  </div>
                </Otherwise>
              </Choose>
            );

            return (
              <Choose>
                {/* Show source badge for source symbols only */}
                <When condition={!source}>
                  <Badge
                    info
                    text={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SOURCE')}
                  >
                    {render}
                  </Badge>
                </When>
                <Otherwise>
                  {render}
                </Otherwise>
              </Choose>
            );
          }}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SECURITIES')}
          render={({ securityName }) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={securityName}>
                  {securityName}
                </When>
                <Otherwise>
                  &mdash;
                </Otherwise>
              </Choose>
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SPREAD_ASK')}
          render={({ askSpread }) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={askSpread}>
                  {askSpread}
                </When>
                <Otherwise>
                  &mdash;
                </Otherwise>
              </Choose>
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SPREAD_BID')}
          render={({ bidSpread }) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={bidSpread}>
                  {bidSpread}
                </When>
                <Otherwise>
                  &mdash;
                </Otherwise>
              </Choose>
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.STOP')}
          render={({ stopsLevel }) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={stopsLevel}>
                  {stopsLevel}
                </When>
                <Otherwise>
                  &mdash;
                </Otherwise>
              </Choose>
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.LONG')}
          render={({ swapConfigs }) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={swapConfigs?.long}>
                  {swapConfigs.long}
                </When>
                <Otherwise>
                  &mdash;
                </Otherwise>
              </Choose>
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SHORT')}
          render={({ swapConfigs }) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={swapConfigs?.short}>
                  {swapConfigs.short}
                </When>
                <Otherwise>
                  &mdash;
                </Otherwise>
              </Choose>
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.DIGITS')}
          render={({ digits }) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={digits}>
                  {digits}
                </When>
                <Otherwise>
                  &mdash;
                </Otherwise>
              </Choose>
            </div>
          )}
        />
      </Table>
    </div>
  );
};

export default React.memo(SymbolsList);
