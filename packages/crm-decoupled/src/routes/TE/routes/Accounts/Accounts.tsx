import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import Hotkeys from 'react-hot-keys';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import permissions from 'config/permissions';
import { Sort, State } from 'types';
import { useModal } from 'providers/ModalProvider';
import { useStorage } from 'providers/StorageProvider';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import { usePermission } from 'providers/PermissionsProvider';
import { accountTypesLabels } from 'constants/accountTypes';
import Badge from 'components/Badge';
import { Button } from 'components/Buttons';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import Uuid from 'components/Uuid';
import NewOrderModal, { NewOrderModalProps } from 'routes/TE/modals/NewOrderModal';
import { tradingEngineTabs } from '../../constants';
import TradingEngineAccountsFilters from './components/AccountsFilter';
import { AccountsQueryVariables, useAccountsQuery, AccountsQuery } from './graphql/__generated__/AccountsQuery';
import './Accounts.scss';

type Account = ExtractApolloTypeFromPageable<AccountsQuery['tradingEngine']['accounts']>;

const Accounts = () => {
  const newOrderModal = useModal<NewOrderModalProps>(NewOrderModal);

  const storage = useStorage();

  const permission = usePermission();

  const state = useLocation().state as State<AccountsQueryVariables['args']>;
  const navigate = useNavigate();

  const accountsQuery = useAccountsQuery({
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

  const { data } = accountsQuery;
  const { content = [], last = true, totalElements } = data?.tradingEngine.accounts || {};
  const page = data?.tradingEngine.accounts.number || 0;

  const handlePageChanged = useHandlePageChanged({
    query: accountsQuery,
    page,
    path: 'page.from',
  });

  const handleSort = (sorts: Sort[]) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  };

  const handleOpenLastOpenedAccount = () => {
    const uuid = storage.get('TE.lastOpenedAccountUuid');

    if (uuid) {
      navigate(`/trading-engine/accounts/${uuid}`);
    }
  };

  const renderTradingAccountColumn = ({ uuid, name, accountType }: Account) => (
    <Fragment>
      <Badge
        text={I18n.t(accountTypesLabels[accountType].label)}
        info={accountType === 'DEMO'}
        success={accountType === 'LIVE'}
      >
        <div className="Accounts__text-primary">
          {name}
        </div>
      </Badge>
      <div className="Accounts__text-secondary">
        <Uuid uuid={uuid} uuidPrefix="TE" />
      </div>
    </Fragment>
  );

  const renderLoginColumn = ({ login, group, uuid, enable }: Account) => (
    <Link to={`/trading-engine/accounts/${uuid}`} target="_blank">
      <div className="Accounts__text-primary">
        <Choose>
          <When condition={!enable}>
            <Badge
              danger
              text={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.ARCHIVED')}
            >
              {login}
            </Badge>
          </When>
          <Otherwise>
            {login}
          </Otherwise>
        </Choose>
      </div>
      <div className="Accounts__text-secondary">
        {group}
      </div>
    </Link>
  );

  const handleNewOrderClick = () => {
    newOrderModal.show();
  };

  return (
    <div className="Accounts">
      {/* Hotkey on F9 button to open new order modal */}
      <If condition={permission.allows(permissions.WE_TRADING.CREATE_ORDER)}>
        <Hotkeys
          keyName="f9"
          onKeyUp={handleNewOrderClick}
        />
      </If>

      {/* Open last opened account by SHIFT+A hot key */}
      <Hotkeys keyName="shift+a" filter={() => true} onKeyUp={handleOpenLastOpenedAccount} />

      <Tabs items={tradingEngineTabs} />

      <div className="Accounts__header">
        <span>
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNTS.HEADLINE')}
        </span>
        <If condition={permission.allows(permissions.WE_TRADING.CREATE_ORDER)}>
          <div className="Accounts__actions">
            <Button
              className="Accounts__action"
              data-testid="Accounts-newOrderButton"
              onClick={handleNewOrderClick}
              tertiary
              small
            >
              {I18n.t('TRADING_ENGINE.ACCOUNTS.NEW_ORDER')}
            </Button>
          </div>
        </If>
      </div>

      <TradingEngineAccountsFilters
        loading={accountsQuery.loading}
        handleRefetch={accountsQuery.refetch}
      />

      <div className="Accounts">
        <Table
          stickyFromTop={125}
          items={content}
          sorts={state?.sorts}
          loading={accountsQuery.loading}
          hasMore={!last}
          onMore={handlePageChanged}
          onSort={handleSort}
        >
          <Column
            sortBy="login"
            header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.LOGIN')}
            render={renderLoginColumn}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.ACCOUNT_ID')}
            render={renderTradingAccountColumn}
          />
          <Column
            sortBy="registrationDate"
            header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.DATE')}
            render={({ registrationDate }) => (
              <If condition={registrationDate}>
                <div className="Accounts__text-primary">
                  {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
                </div>
                <div className="Accounts__text-secondary">
                  {moment.utc(registrationDate).local().format('HH:mm:ss')}
                </div>
              </If>
            )}
          />
          <Column
            sortBy="credit"
            header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.CREDIT')}
            render={({ credit }) => (
              <div className="Accounts__text-primary">{I18n.toCurrency(credit, { unit: '' })}</div>
            )}
          />
          <Column
            sortBy="leverage"
            header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.LEVERAGE')}
            render={({ leverage }) => (
              <If condition={leverage}>
                <div className="Accounts__text-primary">{leverage}</div>
              </If>
            )}
          />
          <Column
            sortBy="balance"
            header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.BALANCE')}
            render={({ balance }) => (
              <div className="Accounts__text-primary">{I18n.toCurrency(balance, { unit: '' })}</div>
            )}
          />
        </Table>
      </div>
    </div>
  );
};

export default React.memo(Accounts);
