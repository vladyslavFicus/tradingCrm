import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import Hotkeys from 'react-hot-keys';
import { Link, useLocation, useHistory } from 'react-router-dom';
import compose from 'compose-function';
import { cloneDeep, set } from 'lodash';
import moment from 'moment';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import { Storage } from 'types/storage';
import { Modal, Sort, State } from 'types';
import { withStorage } from 'providers/StorageProvider';
import { accountTypesLabels } from 'constants/accountTypes';
import Badge from 'components/Badge';
import { Button } from 'components/UI';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import Uuid from 'components/Uuid';
import PermissionContent from 'components/PermissionContent';
import NewOrderModal from 'routes/TE/modals/NewOrderModal';
import { tradingEngineTabs } from '../../constants';
import TradingEngineAccountsFilters from './components/AccountsFilter';
import { AccountsQueryVariables, useAccountsQuery, AccountsQuery } from './graphql/__generated__/AccountsQuery';
import './Accounts.scss';

type Account = ExtractApolloTypeFromPageable<AccountsQuery['tradingEngine']['accounts']>;

interface Props {
  storage: Storage,
  modals: {
    newOrderModal: Modal,
  },
}

const Accounts = (props: Props) => {
  const { modals: { newOrderModal } } = props;

  const { state } = useLocation<State<AccountsQueryVariables['args']>>();
  const history = useHistory();

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

  const { content = [], last = true, totalElements } = accountsQuery.data?.tradingEngine.accounts || {};

  const handlePageChanged = () => {
    const { data, variables, fetchMore } = accountsQuery;

    const page = data?.tradingEngine.accounts.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables as AccountsQueryVariables), 'args.page.from', page + 1),
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

  const handleOpenLastOpenedAccount = () => {
    const uuid = props.storage.get('TE.lastOpenedAccountUuid');

    if (uuid) {
      history.push(`/trading-engine/accounts/${uuid}`);
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
        <Uuid uuid={uuid} uuidPrefix="WT" />
      </div>
    </Fragment>
  );

  const renderLoginColumn = ({ login, group, uuid }: Account) => (
    <Link to={`/trading-engine/accounts/${uuid}`} target="_blank">
      <div className="Accounts__text-primary">
        {login}
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
    <div className="card">
      {/* Hotkey on F9 button to open new order modal */}
      <PermissionContent permissions={permissions.WE_TRADING.CREATE_ORDER}>
        <Hotkeys
          keyName="f9"
          onKeyUp={handleNewOrderClick}
        />
      </PermissionContent>

      {/* Open last opened account by SHIFT+A hot key */}
      <Hotkeys keyName="shift+a" filter={() => true} onKeyUp={handleOpenLastOpenedAccount} />

      <Tabs items={tradingEngineTabs} />

      <div className="Accounts__header card-heading card-heading--is-sticky">
        <span className="font-size-20">
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNTS.HEADLINE')}
        </span>
        <PermissionContent permissions={permissions.WE_TRADING.CREATE_ORDER}>
          <div className="Accounts__actions">
            <Button
              className="Accounts__action"
              onClick={handleNewOrderClick}
              commonOutline
              small
            >
              {I18n.t('TRADING_ENGINE.ACCOUNTS.NEW_ORDER')}
            </Button>
          </div>
        </PermissionContent>
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

export default compose(
  React.memo,
  withStorage,
  withModals({
    newOrderModal: NewOrderModal,
  }),
)(Accounts);