import React, { PureComponent, Fragment } from 'react';
import compose from 'compose-function';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { get } from 'lodash';
import moment from 'moment';
import PropTypes from 'constants/propTypes';
import { getPlatformTypeLabel } from 'utils/tradingAccount';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import { accountTypesLabels } from 'constants/accountTypes';
import { Table, Column } from 'components/Table';
import GridPlayerInfo from 'components/GridPlayerInfo';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import Badge from 'components/Badge';
import UnarchiveButton from '../UnarchiveButton';
import './TradingAccountsListGrid.scss';

class TradingAccountsListGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    permission: PropTypes.permission.isRequired,
    tradingAccountsData: PropTypes.query({
      tradingAccounts: PropTypes.pageable(PropTypes.tradingAccountsItem),
    }).isRequired,
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

  handlePageChanged = () => {
    const {
      location: {
        state,
      },
      tradingAccountsData,
      tradingAccountsData: {
        fetchMore,
        variables,
      },
    } = this.props;

    const page = get(tradingAccountsData, 'data.tradingAccounts.number') || 0;
    const filters = state?.filters;
    const sorts = state?.sorts;
    const size = variables?.page?.size;

    fetchMore({
      variables: {
        ...filters,
        page: {
          from: page + 1,
          size,
          sorts,
        },
      },
    });
  };

  renderTradingAccountColumn = ({ uuid, name, accountType, platformType, archived }) => (
    <Fragment>
      <Badge
        text={I18n.t(archived ? 'CONSTANTS.ARCHIVED' : accountTypesLabels[accountType].label)}
        info={accountType === 'DEMO' && !archived}
        success={accountType === 'LIVE' && !archived}
        danger={archived}
      >
        <div className="TradingAccountsListGrid__general">
          {name}
        </div>
      </Badge>
      <div className="TradingAccountsListGrid__additional">
        <Uuid uuid={uuid} uuidPrefix={getPlatformTypeLabel(platformType)} />
      </div>
    </Fragment>
  );

  renderLoginColumn = ({ login, group, platformType }) => (
    <Fragment>
      <div className="TradingAccountsListGrid__general">
        <PlatformTypeBadge platformType={platformType}>
          {login}
        </PlatformTypeBadge>
      </div>
      <div className="TradingAccountsListGrid__additional">
        {group}
      </div>
    </Fragment>
  );

  renderCreditColumn = ({ credit, currency }) => (
    <div className="TradingAccountsListGrid__general">{currency} {I18n.toCurrency(credit, { unit: '' })}</div>
  );

  renderUnarchivedButton = ({ archived, uuid }) => archived && <UnarchiveButton uuid={uuid} />;

  isArchivedAccountInContent = () => {
    const { tradingAccountsData } = this.props;
    const { content = [] } = tradingAccountsData.data?.tradingAccounts || {};

    return content.some(({ archived }) => archived);
  }

  render() {
    const {
      location,
      tradingAccountsData,
      tradingAccountsData: {
        loading,
      },
    } = this.props;

    const { content = [], last = true } = tradingAccountsData.data?.tradingAccounts || {};
    const isUnarchiveAllow = this.props.permission.allows(permissions.TRADING_ACCOUNT.UNARCHIVE);

    return (
      <div className="TradingAccountsListGrid">
        <Table
          stickyFromTop={125}
          items={content}
          sorts={location?.state?.sorts}
          onSort={this.handleSort}
          loading={loading}
          hasMore={!last}
          onMore={this.handlePageChanged}
        >
          <Column
            sortBy="login"
            header={I18n.t('TRADING_ACCOUNTS.GRID.LOGIN')}
            render={this.renderLoginColumn}
          />
          <Column
            sortBy="name"
            header={I18n.t('TRADING_ACCOUNTS.GRID.ACCOUNT_ID')}
            render={this.renderTradingAccountColumn}
          />
          <Column
            header={I18n.t('TRADING_ACCOUNTS.GRID.PROFILE')}
            render={({ profile }) => (
              <If condition={profile}>
                <GridPlayerInfo profile={profile} />
              </If>
            )}
          />
          <Column
            header={I18n.t('TRADING_ACCOUNTS.GRID.SOURCE_NAME')}
            render={({ affiliate }) => (
              <Choose>
                <When condition={affiliate && affiliate.source}>
                  <div>{affiliate.source}</div>
                </When>
                <Otherwise>
                  <span>&mdash;</span>
                </Otherwise>
              </Choose>
            )}
          />
          <Column
            sortBy="createdAt"
            header={I18n.t('TRADING_ACCOUNTS.GRID.DATE')}
            render={({ createdAt }) => (
              <If condition={createdAt}>
                <div className="TradingAccountsListGrid__general">
                  {moment.utc(createdAt).local().format('DD.MM.YYYY')}
                </div>
                <div className="TradingAccountsListGrid__additional">
                  {moment.utc(createdAt).local().format('HH:mm:ss')}
                </div>
              </If>
            )}
          />
          <Column
            header={I18n.t('TRADING_ACCOUNTS.GRID.CREDIT')}
            render={this.renderCreditColumn}
          />
          <Column
            sortBy="leverage"
            header={I18n.t('TRADING_ACCOUNTS.GRID.LEVERAGE')}
            render={({ leverage }) => (
              <If condition={leverage}>
                <div className="TradingAccountsListGrid__general">{leverage}</div>
              </If>
            )}
          />
          <Column
            sortBy="balance"
            header={I18n.t('TRADING_ACCOUNTS.GRID.BALANCE')}
            render={({ balance, currency }) => (
              <div className="TradingAccountsListGrid__general">
                {currency} {I18n.toCurrency(balance, { unit: '' })}
              </div>
            )}
          />
          <If condition={isUnarchiveAllow && this.isArchivedAccountInContent()}>
            <Column
              header={I18n.t('TRADING_ACCOUNTS.GRID.UNARCHIVE.HEADER')}
              render={this.renderUnarchivedButton}
            />
          </If>
        </Table>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withPermission,
)(TradingAccountsListGrid);
