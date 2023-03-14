import React, { PureComponent, Fragment } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import { withStreams } from 'rsocket';
import { getBrand, getBackofficeBrand } from 'config';
import { withModals } from 'hoc';
import { notify, LevelType } from 'providers/NotificationProvider';
import { getPlatformTypeLabel } from 'utils/tradingAccount';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
import { Button } from 'components/Buttons';
import { accountTypesLabels, leverageStatuses } from 'constants/accountTypes';
import { AdjustableTable, Column } from 'components/Table';
import ActionsDropDown from 'components/ActionsDropDown';
import Badge from 'components/Badge';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import UpdateTradingAccountModal from 'modals/UpdateTradingAccountModal';
import UpdateLeverageModal from 'modals/UpdateLeverageModal';
import UpdateTradingAccountPasswordModal from 'modals/UpdateTradingAccountPasswordModal';
import {
  ApproveChangingLeverageMutation,
  RejectChangingLeverageMutation,
  ToggleDisabledTradingAccountMutation,
} from './graphql';
import './ClientTradingAccountsGrid.scss';

class ClientTradingAccountsGrid extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      updateTradingAccountPasswordModal: PropTypes.modalType,
      updateTradingAccountModal: PropTypes.modalType,
      changeLeverageModal: PropTypes.modalType,
    }).isRequired,
    permission: PropTypes.permission.isRequired,
    toggleDisabledTradingAccount: PropTypes.func.isRequired,
    approveChangingLeverage: PropTypes.func.isRequired,
    rejectChangingLeverage: PropTypes.func.isRequired,
    profileUUID: PropTypes.string.isRequired,
    clientTradingAccountsQuery: PropTypes.query({
      clientTradingAccounts: PropTypes.arrayOf(PropTypes.tradingAccount),
    }).isRequired,
    statistics$: PropTypes.object,
  };

  static defaultProps = {
    statistics$: {},
  };

  handleSetTradingAccountReadonly = (accountUUID, readOnly) => async () => {
    const {
      profileUUID,
      toggleDisabledTradingAccount,
      clientTradingAccountsQuery: {
        refetch,
      },
    } = this.props;

    try {
      await toggleDisabledTradingAccount({
        variables: {
          accountUUID,
          profileId: profileUUID,
          readOnly,
        },
      });

      refetch();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  handleRejectChangeLeverage = accountUUID => async () => {
    const {
      rejectChangingLeverage,
      clientTradingAccountsQuery: {
        refetch,
      },
    } = this.props;

    try {
      await rejectChangingLeverage({ variables: { accountUUID } });

      refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CANCEL_NOTIFICATION'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  handleApproveChangeLeverage = accountUUID => async () => {
    const {
      approveChangingLeverage,
      clientTradingAccountsQuery: {
        refetch,
      },
    } = this.props;

    try {
      await approveChangingLeverage({ variables: { accountUUID } });

      refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.APPROVE_NOTIFICATION'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  renderTradingAccountColumn = ({ accountUUID, name, accountType, platformType, archived }) => (
    <Fragment>
      <Badge
        text={I18n.t(archived ? 'CONSTANTS.ARCHIVED' : accountTypesLabels[accountType].label)}
        info={accountType === 'DEMO' && !archived}
        success={accountType === 'LIVE' && !archived}
        danger={archived}
      >
        <div className="ClientTradingAccountsGrid__cell-main-value">
          {name}
        </div>
      </Badge>
      <div className="ClientTradingAccountsGrid__cell-sub-value">
        <Uuid uuid={accountUUID} uuidPrefix={getPlatformTypeLabel(platformType)} />
      </div>
    </Fragment>
  );

  renderLoginColumn = ({ login, group, platformType }) => (
    <Fragment>
      <div className="ClientTradingAccountsGrid__cell-main-value">
        <PlatformTypeBadge platformType={platformType}>
          {login}
        </PlatformTypeBadge>
      </div>
      <div className="ClientTradingAccountsGrid__cell-sub-value">
        {group}
      </div>
    </Fragment>
  );

  renderBalanceColumn = ({ balance, currency }) => (
    <Fragment>
      <div className="ClientTradingAccountsGrid__cell-main-value">
        {currency} {I18n.toCurrency(balance, { unit: '' })}
      </div>
    </Fragment>
  );

  renderCreditColumn = ({ credit, currency }) => (
    <div className="ClientTradingAccountsGrid__cell-main-value">{currency} {I18n.toCurrency(credit, { unit: '' })}</div>
  );

  renderMarginLevelColumn = ({ login, platformType }) => {
    const statistic$ = this.props.statistics$[login];

    return (
      <Choose>
        {/* All accounts except WET doesn't support account statistic */}
        <When condition={platformType !== 'WET'}>
          <span>&mdash;</span>
        </When>
        <Otherwise>
          <div className="ClientTradingAccountsGrid__cell-main-value">
            {Number((statistic$?.marginLevel || 0) * 100).toFixed(2)}%
          </div>
        </Otherwise>
      </Choose>
    );
  }

  renderProfitColumn = ({ login, platformType }) => {
    const statistic$ = this.props.statistics$[login];

    return (
      <Choose>
        {/* All accounts except WET doesn't support account statistic */}
        <When condition={platformType !== 'WET'}>
          <span>&mdash;</span>
        </When>
        <Otherwise>
          <div className="ClientTradingAccountsGrid__cell-main-value">
            {Number(statistic$?.openPnL || 0).toFixed(2)}
          </div>
        </Otherwise>
      </Choose>
    );
  }

  renderLeverageColumn = (tradingAccount) => {
    const { leverage, accountUUID } = tradingAccount;

    const {
      changeLeverageFrom,
      changeLeverageTo,
      status,
      createDate,
    } = tradingAccount?.lastLeverageChangeRequest || {};

    return (
      <Fragment>
        <Choose>
          <When condition={tradingAccount.lastLeverageChangeRequest}>
            <Choose>
              <When condition={status === 'COMPLETED'}>
                <div>
                  <div className="ClientTradingAccountsGrid__cell-main-value">{changeLeverageTo}</div>
                  <div className="ClientTradingAccountsGrid__cell-sub-value">
                    {I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.FROM')} {changeLeverageFrom}
                  </div>
                </div>
              </When>
              <Otherwise>
                <div>
                  <div className="ClientTradingAccountsGrid__cell-main-value">{changeLeverageFrom}</div>
                  <div className="ClientTradingAccountsGrid__cell-sub-value">
                    {I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.TO')} {changeLeverageTo}
                  </div>
                </div>
              </Otherwise>
            </Choose>
          </When>
          <Otherwise>
            <div className="ClientTradingAccountsGrid__cell-main-value">{leverage}</div>
          </Otherwise>
        </Choose>
        <div
          className={
            classNames(
              'ClientTradingAccountsGrid__cell-main-value',
              'ClientTradingAccountsGrid__cell-main-value--upper',
              'ClientTradingAccountsGrid__leverage-status',
              {
                'ClientTradingAccountsGrid__leverage-status--pending': status === leverageStatuses.PENDING,
                'ClientTradingAccountsGrid__leverage-status--completed': status === leverageStatuses.COMPLETED,
                'ClientTradingAccountsGrid__leverage-status--canceled': status === leverageStatuses.CANCELED,
                'ClientTradingAccountsGrid__leverage-status--rejected': status === leverageStatuses.REJECTED,
                'ClientTradingAccountsGrid__leverage-status--failed': status === leverageStatuses.FAILED,
              },
            )
          }
        >
          {status}
        </div>
        <If condition={createDate}>
          <div
            className={
              classNames(
                'ClientTradingAccountsGrid__cell-sub-value',
                'ClientTradingAccountsGrid__cell-sub-value--mb-5',
              )
            }
          >
            {`${I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.SINCE')}
              ${moment.utc(createDate).local().format('DD.MM.YYYY HH:mm')}`
            }
          </div>
        </If>
        <If condition={status === 'PENDING'}>
          <Button
            className="ClientTradingAccountsGrid__cell-button"
            onClick={this.handleRejectChangeLeverage(accountUUID)}
            tertiary
            small
          >
            {I18n.t('COMMON.REJECT')}
          </Button>
          <Button
            className="ClientTradingAccountsGrid__cell-button"
            onClick={this.handleApproveChangeLeverage(accountUUID)}
            tertiary
            small
          >
            {I18n.t('COMMON.APPROVE')}
          </Button>
        </If>
      </Fragment>
    );
  };

  renderTradingStatusColumn = ({ readOnly, readOnlyUpdateTime, readOnlyUpdatedBy, operator }) => (
    <Fragment>
      <div className={
        classNames(
          'ClientTradingAccountsGrid__cell-main-value',
          'ClientTradingAccountsGrid__cell-main-value--upper',
          'ClientTradingAccountsGrid__status',
          {
            'ClientTradingAccountsGrid__status--disabled': readOnly,
            'ClientTradingAccountsGrid__status--enabled': !readOnly,
          },
        )
      }
      >
        {I18n.t(`CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.${!readOnly ? 'ENABLED' : 'DISABLED'}`)}
      </div>
      <Choose>
        <When condition={readOnlyUpdatedBy === 'SYSTEM'}>
          <div
            className={
              classNames(
                'ClientTradingAccountsGrid__cell-main-value',
                'ClientTradingAccountsGrid__cell-main-value--small',
              )
            }
          >
            {I18n.t('CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.UPDATED_BY', { updatedBy: 'SYSTEM' })}
          </div>
        </When>

        <When condition={readOnlyUpdatedBy && operator?.fullName}>
          <Link to={`/operators/${readOnlyUpdatedBy}`}>
            <div
              className={
                classNames(
                  'ClientTradingAccountsGrid__cell-main-value',
                  'ClientTradingAccountsGrid__cell-main-value--small',
                )
              }
            >
              {I18n.t('CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.UPDATED_BY', { updatedBy: operator.fullName })}
            </div>
          </Link>
        </When>
      </Choose>
      <If condition={readOnlyUpdateTime}>
        <div className="ClientTradingAccountsGrid__cell-sub-value">
          {I18n.t('CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.UPDATED_AT', {
            updatedAt: moment(readOnlyUpdateTime).format('DD.MM.YYYY HH:mm'),
          })}
        </div>
      </If>
    </Fragment>
  );

  renderServerColumn = ({ accountType, platformType }) => (
    <div className="ClientTradingAccountsGrid__cell-main-value">{getPlatformTypeLabel(platformType)} {accountType}</div>
  );

  renderActionsColumn = (
    {
      readOnly,
      accountType,
      archived,
      accountUUID,
      login,
      name,
      group,
      leverage,
      platformType,
    },
  ) => {
    const {
      permission,
      modals: {
        updateTradingAccountPasswordModal,
        updateTradingAccountModal,
        changeLeverageModal,
      },
      profileUUID,
      clientTradingAccountsQuery: {
        refetch,
      },
    } = this.props;

    const brand = getBrand();

    const dropDownActions = [];

    if (platformType !== 'WET') {
      dropDownActions.push({
        label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
        onClick: () => updateTradingAccountPasswordModal.show({ accountUUID, profileUUID, login }),
      });
    }

    const canRenameAccount = permission.allows(permissions.TRADING_ACCOUNT.RENAME_ACCOUNT);

    if (canRenameAccount) {
      dropDownActions.push({
        label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.RENAME'),
        onClick: () => updateTradingAccountModal.show({
          accountUUID,
          name,
          onSuccess: refetch,
        }),
      });
    }

    if (brand[platformType.toLowerCase()]?.leveragesChangingRequest?.length) {
      dropDownActions.push({
        label: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        onClick: () => changeLeverageModal.show({
          name,
          login,
          group,
          leverage,
          accountType,
          platformType,
          archived,
          accountUUID,
          onSuccess: refetch,
        }),
      });
    }

    const isReadOnly = permission.allows(permissions.TRADING_ACCOUNT.READ_ONLY);

    if (isReadOnly) {
      if (accountType !== 'DEMO') {
        dropDownActions.push({
          label: I18n.t(`CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.${!readOnly ? 'DISABLE' : 'ENABLE'}`),
          onClick: this.handleSetTradingAccountReadonly(accountUUID, !readOnly),
        });
      }
    }

    if (!archived) {
      return (<ActionsDropDown items={dropDownActions} />);
    }

    return null;
  };

  render() {
    const {
      permission: {
        permissions: currentPermissions,
      },
      clientTradingAccountsQuery: {
        data,
        loading,
      },
    } = this.props;

    const updatePasswordPermission = (new Permissions(permissions.TRADING_ACCOUNT.UPDATE_PASSWORD))
      .check(currentPermissions);

    const tradingAccounts = data?.clientTradingAccounts || [];
    const columnsOrder = getBackofficeBrand()?.tables?.clientTradingAccounts?.columnsOrder;

    return (
      <div className="ClientTradingAccountsGrid">
        <AdjustableTable
          columnsOrder={columnsOrder}
          stickyFromTop={189}
          items={tradingAccounts}
          loading={loading}
        >
          <Column
            name="account"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.TRADING_ACC')}
            render={this.renderTradingAccountColumn}
          />
          <Column
            name="login"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.LOGIN')}
            render={this.renderLoginColumn}
          />
          <Column
            name="balance"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.BALANCE/EQUITY')}
            render={this.renderBalanceColumn}
          />
          <Column
            name="credit"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.CREDIT')}
            render={this.renderCreditColumn}
          />
          <Column
            name="leverage"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.LEVERAGE')}
            render={this.renderLeverageColumn}
          />
          <Column
            name="marginLevel"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.MARGIN_LEVEL')}
            render={this.renderMarginLevelColumn}
          />
          <Column
            name="profit"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.PROFIT')}
            render={this.renderProfitColumn}
          />
          <Column
            name="status"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.TRADING_STATUS')}
            render={this.renderTradingStatusColumn}
          />
          <Column
            name=""
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.SERVER')}
            render={this.renderServerColumn}
          />
          <If condition={updatePasswordPermission}>
            <Column
              name="actions"
              width={60}
              render={this.renderActionsColumn}
            />
          </If>
        </AdjustableTable>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withModals({
    updateTradingAccountPasswordModal: UpdateTradingAccountPasswordModal,
    updateTradingAccountModal: UpdateTradingAccountModal,
    changeLeverageModal: UpdateLeverageModal,
  }),
  withRequests({
    approveChangingLeverage: ApproveChangingLeverageMutation,
    rejectChangingLeverage: RejectChangingLeverageMutation,
    toggleDisabledTradingAccount: ToggleDisabledTradingAccountMutation,
  }),
  withStreams(({ clientTradingAccountsQuery }) => ({
    statistics$: {
      route: 'streamAccountStatisticsByLogins',
      data: {
        logins: (clientTradingAccountsQuery.data?.clientTradingAccounts || [])
          .filter(({ platformType }) => platformType === 'WET')
          .map(({ login }) => login),
      },
      accumulator: (curr, next) => ({ ...curr, [next.data.login]: next.data }),
      skip: !(clientTradingAccountsQuery.data?.clientTradingAccounts || []).length,
    },
  })),
)(ClientTradingAccountsGrid);
