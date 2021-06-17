import React, { PureComponent, Fragment } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import { getBrand } from 'config';
import { withModals, withNotifications } from 'hoc';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
import { Button } from 'components/UI';
import { accountTypesLabels, leverageStatusesColor } from 'constants/accountTypes';
import { Table, Column } from 'components/Table';
import ActionsDropDown from 'components/ActionsDropDown';
import Badge from 'components/Badge';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import UpdateTradingAccountModal from 'modals/UpdateTradingAccountModal';
import ChangeLeverageModal from 'modals/ChangeLeverageModal';
import TradingAccountChangePasswordModal from 'modals/TradingAccountChangePasswordModal';
import {
  UpdateTradingAccountMutation,
  ApproveChangingLeverageMutation,
  RejectChangingLeverageMutation,
} from './graphql';
import './ClientTradingAccountsGrid.scss';

class ClientTradingAccountsGrid extends PureComponent {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      tradingAccountChangePasswordModal: PropTypes.modalType,
      updateTradingAccountModal: PropTypes.modalType,
      changeLeverageModal: PropTypes.modalType,
    }).isRequired,
    permission: PropTypes.permission.isRequired,
    updateTradingAccount: PropTypes.func.isRequired,
    approveChangingLeverage: PropTypes.func.isRequired,
    rejectChangingLeverage: PropTypes.func.isRequired,
    profileUUID: PropTypes.string.isRequired,
    clientTradingAccountsQuery: PropTypes.query({
      clientTradingAccounts: PropTypes.arrayOf(PropTypes.tradingAccount),
    }).isRequired,
  };

  handleSetTradingAccountReadonly = (accountUUID, readOnly) => async () => {
    const {
      notify,
      profileUUID,
      updateTradingAccount,
      clientTradingAccountsQuery: {
        refetch,
      },
    } = this.props;

    try {
      await updateTradingAccount({
        variables: {
          accountUUID,
          profileId: profileUUID,
          readOnly,
        },
      });

      refetch();
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  handleRejectChangeLeverage = accountUUID => async () => {
    const {
      notify,
      rejectChangingLeverage,
      clientTradingAccountsQuery: {
        refetch,
      },
    } = this.props;

    try {
      await rejectChangingLeverage({ variables: { accountUUID } });

      refetch();

      notify({
        level: 'success',
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CANCEL_NOTIFICATION'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  handleApproveChangeLeverage = accountUUID => async () => {
    const {
      notify,
      approveChangingLeverage,
      clientTradingAccountsQuery: {
        refetch,
      },
    } = this.props;

    try {
      await approveChangingLeverage({ variables: { accountUUID } });

      refetch();

      notify({
        level: 'success',
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.CHANGE_LEVERAGE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.APPROVE_NOTIFICATION'),
      });
    } catch {
      notify({
        level: 'error',
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
        <Uuid uuid={accountUUID} uuidPrefix={platformType} />
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
              leverageStatusesColor[status],
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
            {`${I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.SINCE')} ${
              moment.utc(createDate).local().format('DD.MM.YYYY HH:mm')
              }`}
          </div>
        </If>
        <If condition={status === 'PENDING'}>
          <Button
            className="ClientTradingAccountsGrid__cell-button"
            onClick={this.handleRejectChangeLeverage(accountUUID)}
            commonOutline
            small
          >
            {I18n.t('COMMON.REJECT')}
          </Button>
          <Button
            className="ClientTradingAccountsGrid__cell-button"
            onClick={this.handleApproveChangeLeverage(accountUUID)}
            primaryOutline
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
          {
            'color-danger': readOnly,
            'color-success': !readOnly,
          },
        )
      }
      >
        {I18n.t(`CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.${!readOnly ? 'ENABLED' : 'DISABLED'}`)}
      </div>
      <If condition={readOnlyUpdatedBy}>
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
      </If>
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
    <div className="ClientTradingAccountsGrid__cell-main-value">{platformType} {accountType}</div>
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
      modals: {
        tradingAccountChangePasswordModal,
        updateTradingAccountModal,
        changeLeverageModal,
      },
      profileUUID,
      clientTradingAccountsQuery: {
        refetch,
      },
    } = this.props;

    const brand = getBrand();

    const dropDownActions = [
      {
        label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
        onClick: () => tradingAccountChangePasswordModal.show({ accountUUID, profileUUID, login }),
      },
      {
        label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.RENAME'),
        onClick: () => updateTradingAccountModal.show({
          accountUUID,
          profileUUID,
          onSuccess: refetch,
        }),
      },
    ];

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

    if (accountType !== 'DEMO') {
      dropDownActions.push({
        label: I18n.t(`CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.${!readOnly ? 'DISABLE' : 'ENABLE'}`),
        onClick: this.handleSetTradingAccountReadonly(accountUUID, !readOnly),
      });
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

    return (
      <div className="ClientTradingAccountsGrid">
        <Table
          stickyFromTop={189}
          items={tradingAccounts}
          loading={loading}
        >
          <Column
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.TRADING_ACC')}
            render={this.renderTradingAccountColumn}
          />
          <Column
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.LOGIN')}
            render={this.renderLoginColumn}
          />
          <Column
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.BALANCE/EQUITY')}
            render={this.renderBalanceColumn}
          />
          <Column
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.CREDIT')}
            render={this.renderCreditColumn}
          />
          <Column
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.LEVERAGE')}
            render={this.renderLeverageColumn}
          />
          <Column
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.TRADING_STATUS')}
            render={this.renderTradingStatusColumn}
          />
          <Column
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.SERVER')}
            render={this.renderServerColumn}
          />
          <If condition={updatePasswordPermission}>
            <Column width={60} render={this.renderActionsColumn} />
          </If>
        </Table>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withNotifications,
  withModals({
    tradingAccountChangePasswordModal: TradingAccountChangePasswordModal,
    updateTradingAccountModal: UpdateTradingAccountModal,
    changeLeverageModal: ChangeLeverageModal,
  }),
  withRequests({
    updateTradingAccount: UpdateTradingAccountMutation,
    approveChangingLeverage: ApproveChangingLeverageMutation,
    rejectChangingLeverage: RejectChangingLeverageMutation,
  }),
)(ClientTradingAccountsGrid);
