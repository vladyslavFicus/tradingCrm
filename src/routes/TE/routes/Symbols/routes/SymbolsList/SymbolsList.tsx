import React from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import compose from 'compose-function';
import classNames from 'classnames';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { State, Sort, LevelType, Notify } from 'types';
import permissions from 'config/permissions';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import { Button, TrashButton } from 'components/Buttons';
import { Link } from 'components/Link';
import PermissionContent from 'components/PermissionContent';
import Badge from 'components/Badge';
import { tradingEngineTabs } from 'routes/TE/constants';
import SymbolsFilter from './components/SymbolsFilter';
import { useSymbolsQuery, SymbolsQueryVariables, SymbolsQuery } from './graphql/__generated__/SymbolsQuery';
import { useDeleteSymbolMutation } from './graphql/__generated__/DeleteSymbolMutation';
import './SymbolsList.scss';

type SymbolType = ExtractApolloTypeFromPageable<SymbolsQuery['tradingEngine']['symbols']>;

type Props = {
  notify: Notify,
}

const SymbolsList = ({
  notify,
}: Props) => {
  const history = useHistory();
  const { state } = useLocation<State<SymbolsQueryVariables['args']>>();
  const [deleteSymbol] = useDeleteSymbolMutation();
  const permission = usePermission();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  // New confirmation instance is needed to show an error when archiving a group
  // since the submit handle works after it is shown again and closes it
  const confirmErrorModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

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

  const handleDeleteSymbol = async (symbolName: string, force = false) => {
    try {
      await deleteSymbol({
        variables: {
          symbolName,
          force,
        },
      });

      await symbolsQuery.refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.SYMBOL.NOTIFICATION.SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.symbol.has.opened.orders') {
        confirmErrorModal.show({
          onSubmit: () => handleDeleteSymbol(symbolName, true),
          modalTitle: I18n.t('TRADING_ENGINE.SYMBOL.CONFIRMATION.DELETE.TITLE'),
          actionText: I18n.t('TRADING_ENGINE.SYMBOL.CONFIRMATION.DELETE.DESCRIPTION_DELETE_SYMBOL',
            { orders: error.errorParameters.openedOrdersCount }),
          submitButtonLabel: I18n.t('COMMON.OK'),
        });
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('TRADING_ENGINE.SYMBOL.NOTIFICATION.FAILED'),
        });
      }
    }
  };

  const handleDeleteSymbolClick = (symbol: string) => {
    confirmActionModal.show({
      onSubmit: () => handleDeleteSymbol(symbol),
      modalTitle: I18n.t('TRADING_ENGINE.SYMBOL.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.SYMBOL.CONFIRMATION.DELETE.DESCRIPTION', { symbol }),
      submitButtonLabel: I18n.t('COMMON.OK'),
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
              tertiary
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
        customClassNameRow={({ enabled }: SymbolType) => (
          classNames({
            'SymbolsList--is-disabled': !enabled,
          }))
        }
      >
        <Column
          header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.SYMBOL')}
          render={({ symbol, source }: SymbolType) => {
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
          render={({ securityName }: SymbolType) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={!!securityName}>
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
          render={({ askSpread }: SymbolType) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={!!askSpread}>
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
          render={({ bidSpread }: SymbolType) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={!!bidSpread}>
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
          render={({ stopsLevel }: SymbolType) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={!!stopsLevel}>
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
          render={({ swapConfigs }: SymbolType) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={!!swapConfigs?.long}>
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
          render={({ swapConfigs }: SymbolType) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={!!swapConfigs?.short}>
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
          render={({ digits }: SymbolType) => (
            <div className="SymbolsList__cell-primary">
              <Choose>
                <When condition={!!digits}>
                  {digits}
                </When>
                <Otherwise>
                  &mdash;
                </Otherwise>
              </Choose>
            </div>
          )}
        />
        <Column
          width={120}
          header={I18n.t('TRADING_ENGINE.SYMBOLS.GRID.ACTIONS')}
          render={({ symbol, enabled }: SymbolType) => (
            <If condition={enabled}>
              <PermissionContent permissions={permissions.WE_TRADING.DELETE_SYMBOL}>
                <TrashButton onClick={() => handleDeleteSymbolClick(symbol)} />
              </PermissionContent>
            </If>
          )}
        />
      </Table>
    </div>
  );
};

export default compose(
  React.memo,
  withNotifications,
)(SymbolsList);
