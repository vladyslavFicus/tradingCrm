import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import Hotkeys from 'react-hot-keys';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { get } from 'lodash';
import moment from 'moment';
import withModals from 'hoc/withModals';
import { withStorage } from 'providers/StorageProvider';
import { accountTypesLabels } from 'constants/accountTypes';
import PropTypes from 'constants/propTypes';
import Badge from 'components/Badge';
import { Button } from 'components/UI';
import { Table, Column } from 'components/Table';
import GridPlayerInfo from 'components/GridPlayerInfo';
import Tabs from 'components/Tabs';
import Uuid from 'components/Uuid';
import EventEmitter, { ORDER_RELOAD } from 'utils/EventEmitter';
import CommonNewOrderModal from '../../modals/CommonNewOrderModal';
import { tradingEngineTabs } from '../../constants';
import TradingEngineAccountsFilters from './components/TradingEngineAccountsFilters';
import TradingEngineAccountsQuery from './graphql/TradingEngineAccountsQuery';
import './TradingEngineAccountsGrid.scss';

class TradingEngineAccountsGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    ...withStorage.propTypes,
    accounts: PropTypes.query({
      tradingEngineAccountsData: PropTypes.pageable(PropTypes.tradingAccountsItem),
    }).isRequired,
    modals: PropTypes.shape({
      newOrderModal: PropTypes.modal,
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      location: {
        state,
      },
      accounts: {
        data,
        loadMore,
        variables,
      },
    } = this.props;

    const currentPage = data?.tradingEngineAccounts?.number || 0;
    const filters = state?.filters || {};
    const size = variables?.args?.page?.size;
    const sorts = state?.sorts;

    loadMore({
      args: {
        ...filters,
        page: {
          from: currentPage + 1,
          size,
          sorts,
        },
      },
    });
  };

  handleSort = (sorts) => {
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
      window.open(`/trading-engine-manager/accounts/${uuid}`);
    }
  };

  renderTradingAccountColumn = ({ uuid, name, accountType, platformType, archived }) => (
    <Fragment>
      <Badge
        text={I18n.t(archived ? 'CONSTANTS.ARCHIVED' : accountTypesLabels[accountType].label)}
        info={accountType === 'DEMO' && !archived}
        success={accountType === 'LIVE' && !archived}
        danger={archived}
      >
        <div className="font-weight-700">
          {name}
        </div>
      </Badge>
      <div className="font-size-11">
        <Uuid uuid={uuid} uuidPrefix={platformType} />
      </div>
    </Fragment>
  );

  renderLoginColumn = ({ login, group, uuid }) => (
    <Link to={`/trading-engine-manager/accounts/${uuid}`}>
      <div className="font-weight-700">
        {login}
      </div>
      <div className="font-size-11">
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
              sortBy="profileFullName"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.PROFILE')}
              render={({ profileUuid, profileFullName }) => (
                <GridPlayerInfo profile={{ uuid: profileUuid, fullName: profileFullName }} />
              )}
            />
            <Column
              sortBy="registrationDate"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.DATE')}
              render={({ registrationDate }) => (
                <If condition={registrationDate}>
                  <div className="font-weight-700">
                    {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
                  </div>
                  <div className="font-size-11">
                    {moment.utc(registrationDate).local().format('HH:mm:ss')}
                  </div>
                </If>
              )}
            />
            <Column
              sortBy="credit"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.CREDIT')}
              render={({ credit }) => (
                <div className="font-weight-700">{I18n.toCurrency(credit, { unit: '' })}</div>
              )}
            />
            <Column
              sortBy="leverage"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.LEVERAGE')}
              render={({ leverage }) => (
                <If condition={leverage}>
                  <div className="font-weight-700">{leverage}</div>
                </If>
              )}
            />
            <Column
              sortBy="balance"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.BALANCE')}
              render={({ balance }) => (
                <div className="font-weight-700">{I18n.toCurrency(balance, { unit: '' })}</div>
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
