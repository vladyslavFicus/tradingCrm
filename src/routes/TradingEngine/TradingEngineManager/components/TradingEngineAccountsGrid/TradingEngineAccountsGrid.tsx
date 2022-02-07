import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import Hotkeys from 'react-hot-keys';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { get } from 'lodash';
import moment from 'moment';
import { Modal } from 'types/modal';
import { Storage } from 'types/storage';
import { Sort, State, Page, Pageable, Query } from 'types';
import withModals from 'hoc/withModals';
import { withStorage } from 'providers/StorageProvider';
import { accountTypesLabels } from 'constants/accountTypes';
import Badge from 'components/Badge';
import { Button } from 'components/UI';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import Uuid from 'components/Uuid';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import CommonNewOrderModal from '../../modals/CommonNewOrderModal';
import { tradingEngineTabs } from '../../constants';
import TradingEngineAccountsFilters from './components/TradingEngineAccountsFilters';
import TradingEngineAccountsQuery from './graphql/TradingEngineAccountsQuery';
import { TradingAccountItem } from './types';
import './TradingEngineAccountsGrid.scss';

interface Props {
  accounts: Query<
    { tradingEngineAccounts: Pageable<TradingAccountItem> },
    { args: { page: Page } }
  >,
  modals: {
    newOrderModal: Modal<{
      mutableLogin: boolean,
      onSuccess: () => void,
    }>,
  },
  storage: Storage,
}

class TradingEngineAccountsGrid extends PureComponent<Props & RouteComponentProps<any, any, State>> {
  handlePageChanged = () => {
    const {
      location: {
        state,
      },
      accounts: {
        data,
        fetchMore,
        variables,
      },
    } = this.props;

    const currentPage = data?.tradingEngineAccounts?.number || 0;
    const filters = state?.filters || {};
    const size = variables?.args?.page?.size || 20;
    const sorts = state?.sorts;

    fetchMore({
      variables: {
        args: {
          ...filters,
          page: {
            from: currentPage + 1,
            size,
            sorts,
          },
        },
      },
    });
  };

  handleSort = (sorts: Sort[]) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  handleOpenLastOpenedAccount = () => {
    const uuid = this.props.storage.get('TE.lastOpenedAccountUuid');

    if (uuid) {
      this.props.history.push(`/trading-engine-manager/accounts/${uuid}`);
    }
  };

  renderTradingAccountColumn = ({ uuid, name, accountType }: TradingAccountItem) => (
    <Fragment>
      <Badge
        text={I18n.t(accountTypesLabels[accountType].label)}
        info={accountType === 'DEMO'}
        success={accountType === 'LIVE'}
      >
        <div className="TradingEngineAccountsGrid__text-primary">
          {name}
        </div>
      </Badge>
      <div className="TradingEngineAccountsGrid__text-secondary">
        <Uuid uuid={uuid} uuidPrefix="WT" />
      </div>
    </Fragment>
  );

  renderLoginColumn = ({ login, group, uuid }: TradingAccountItem) => (
    <Link to={`/trading-engine-manager/accounts/${uuid}`} target="_blank">
      <div className="TradingEngineAccountsGrid__text-primary">
        {login}
      </div>
      <div className="TradingEngineAccountsGrid__text-secondary">
        {group}
      </div>
    </Link>
  );

  handleNewOrderClick = () => {
    this.props.modals.newOrderModal.show({
      mutableLogin: true,
      onSuccess: () => EventEmitter.emit(ORDER_RELOAD),
    });
  };

  render() {
    const {
      location: { state },
      accounts,
      accounts: {
        loading,
      },
    } = this.props;

    const { content = [], last = true } = accounts.data?.tradingEngineAccounts || {};

    const totalElements = get(accounts, 'data.tradingEngineAccounts.totalElements') || 0;


    return (
      <div className="card">
        {/* Hotkey on F9 button to open new order modal */}
        <Hotkeys
          keyName="f9"
          onKeyUp={this.handleNewOrderClick}
        />

        {/* Open last opened account by SHIFT+A hot key */}
        <Hotkeys keyName="shift+a" filter={() => true} onKeyUp={this.handleOpenLastOpenedAccount} />

        <Tabs items={tradingEngineTabs} />

        <div className="TradingEngineAccountsGrid__header card-heading card-heading--is-sticky">
          <span className="font-size-20">
            <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNTS.HEADLINE')}
          </span>
          <div className="TradingEngineAccountsGrid__actions">
            <Button
              className="TradingEngineAccountsGrid__action"
              onClick={this.handleNewOrderClick}
              commonOutline
              small
            >
              New order
            </Button>
          </div>
        </div>

        <TradingEngineAccountsFilters
          loading={loading}
          handleRefetch={accounts.refetch}
        />

        <div className="TradingEngineAccountsGrid">
          <Table
            stickyFromTop={125}
            items={content}
            sorts={state?.sorts}
            loading={loading}
            hasMore={!last}
            onMore={this.handlePageChanged}
            onSort={this.handleSort}
          >
            <Column
              sortBy="login"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.LOGIN')}
              render={this.renderLoginColumn}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.ACCOUNT_ID')}
              render={this.renderTradingAccountColumn}
            />
            <Column
              sortBy="registrationDate"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.DATE')}
              render={({ registrationDate }) => (
                <If condition={registrationDate}>
                  <div className="TradingEngineAccountsGrid__text-primary">
                    {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
                  </div>
                  <div className="TradingEngineAccountsGrid__text-secondary">
                    {moment.utc(registrationDate).local().format('HH:mm:ss')}
                  </div>
                </If>
              )}
            />
            <Column
              sortBy="credit"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.CREDIT')}
              render={({ credit }) => (
                <div className="TradingEngineAccountsGrid__text-primary">{I18n.toCurrency(credit, { unit: '' })}</div>
              )}
            />
            <Column
              sortBy="leverage"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.LEVERAGE')}
              render={({ leverage }) => (
                <If condition={leverage}>
                  <div className="TradingEngineAccountsGrid__text-primary">{leverage}</div>
                </If>
              )}
            />
            <Column
              sortBy="balance"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.BALANCE')}
              render={({ balance }) => (
                <div className="TradingEngineAccountsGrid__text-primary">{I18n.toCurrency(balance, { unit: '' })}</div>
              )}
            />
          </Table>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withStorage,
  withRequests({
    accounts: TradingEngineAccountsQuery,
  }),
  withModals({
    newOrderModal: CommonNewOrderModal,
  }),
)(TradingEngineAccountsGrid);
