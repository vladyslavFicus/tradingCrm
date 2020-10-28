import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import moment from 'moment';
import { get } from 'lodash';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import { getActiveBrandConfig } from 'config';
import { withModals, withNotifications } from 'hoc';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
import { Button } from 'components/UI';
import { accountTypesLabels, leverageStatusesColor } from 'constants/accountTypes';
import Grid, { GridColumn } from 'components/Grid';
import ActionsDropDown from 'components/ActionsDropDown';
import Badge from 'components/Badge';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import UpdateTradingAccountModal from 'modals/UpdateTradingAccountModal';
import updateTradingAccountMutation from './graphql/updateTradingAccountMutation';
import approveChangingLeverageMutation from './graphql/approveChangingLeverageMutation';
import rejectChangingLeverageMutation from './graphql/rejectChangingLeverageMutation';
import TradingAccountChangePasswordModal from './TradingAccountChangePasswordModal';
import ChangeLeverageModal from './ChangeLeverageModal';

class TradingAccountsGrid extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      tradingAccountChangePasswordModal: PropTypes.modalType,
      updateTradingAccountModal: PropTypes.modalType,
      changeLeverageModal: PropTypes.modalType,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
    tradingAccounts: PropTypes.arrayOf(PropTypes.tradingAccount).isRequired,
    updateTradingAccount: PropTypes.func.isRequired,
    approveChangingLeverage: PropTypes.func.isRequired,
    rejectChangingLeverage: PropTypes.func.isRequired,
    refetchTradingAccountsList: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
    profileUuid: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleSetTradingAccountReadonly = (accountUUID, readOnly) => async () => {
    const {
      notify,
      profileUuid,
      updateTradingAccount,
      refetchTradingAccountsList,
    } = this.props;

    try {
      await updateTradingAccount({
        variables: {
          accountUUID,
          profileId: profileUuid,
          readOnly,
        },
      });

      refetchTradingAccountsList();
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
      refetchTradingAccountsList,
    } = this.props;

    try {
      await rejectChangingLeverage({ variables: { accountUUID } });

      refetchTradingAccountsList();

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
      refetchTradingAccountsList,
    } = this.props;

    try {
      await approveChangingLeverage({ variables: { accountUUID } });

      refetchTradingAccountsList();

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
        <div className="font-weight-700">
          {name}
        </div>
      </Badge>
      <div className="font-size-11">
        <Uuid uuid={accountUUID} uuidPrefix={platformType} />
      </div>
    </Fragment>
  );

  renderLoginColumn = ({ login, group, platformType }) => (
    <Fragment>
      <div className="font-weight-700">
        <PlatformTypeBadge platformType={platformType}>
          {login}
        </PlatformTypeBadge>
      </div>
      <div className="font-size-11">
        {group}
      </div>
    </Fragment>
  );

  renderBalanceColumn = ({ balance, symbol }) => (
    <Fragment>
      <div className="font-weight-700">
        {symbol} {Number(balance).toFixed(2)}
      </div>
    </Fragment>
  );

  renderCreditColumn = ({ credit, symbol }) => (
    <div className="font-weight-700">{symbol} {Number(credit).toFixed(2)}</div>
  );

  renderLeverageColumn = (tradingAccount) => {
    const { leverage, accountUUID } = tradingAccount;

    const {
      changeLeverageFrom,
      changeLeverageTo,
      status,
      createDate,
    } = get(tradingAccount, 'lastLeverageChangeRequest') || {};

    return (
      <Fragment>
        <Choose>
          <When condition={tradingAccount.lastLeverageChangeRequest}>
            <Choose>
              <When condition={status === 'COMPLETED'}>
                <div>
                  <div className="font-weight-700">{changeLeverageTo}</div>
                  <div className="font-size-11">
                    {I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.FROM')} {changeLeverageFrom}
                  </div>
                </div>
              </When>
              <Otherwise>
                <div>
                  <div className="font-weight-700">{changeLeverageFrom}</div>
                  <div className="font-size-11">
                    {I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.TO')} {changeLeverageTo}
                  </div>
                </div>
              </Otherwise>
            </Choose>
          </When>
          <Otherwise>
            <div className="font-weight-700">{leverage}</div>
          </Otherwise>
        </Choose>
        <div className={classNames('font-weight-700 text-uppercase', leverageStatusesColor[status])}>
          {status}
        </div>
        <If condition={createDate}>
          <div className="font-size-11 margin-bottom-5">
            {`${I18n.t('CLIENT_PROFILE.ACCOUNTS.LEVERAGE.SINCE')} ${
              moment.utc(createDate).local().format('DD.MM.YYYY HH:mm')
              }`}
          </div>
        </If>
        <If condition={status === 'PENDING'}>
          <Button
            small
            commonOutline
            className="margin-right-10"
            onClick={this.handleRejectChangeLeverage(accountUUID)}
          >
            {I18n.t('COMMON.REJECT')}
          </Button>
          <Button
            small
            primaryOutline
            onClick={this.handleApproveChangeLeverage(accountUUID)}
          >
            {I18n.t('COMMON.APPROVE')}
          </Button>
        </If>
      </Fragment>
    );
  };

  renderTradingStatusColumn = ({ readOnly, readOnlyUpdateTime, readOnlyUpdatedBy, operator }) => (
    <Fragment>
      <div className={classNames('font-weight-700 text-uppercase', {
        'color-danger': readOnly,
        'color-success': !readOnly,
      })}
      >
        {I18n.t(`CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.${!readOnly ? 'ENABLED' : 'DISABLED'}`)}
      </div>
      <If condition={readOnlyUpdatedBy}>
        <Link to={`/operators/${readOnlyUpdatedBy}`}>
          <div className="font-size-11 font-weight-700">
            {I18n.t('CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.UPDATED_BY', { updatedBy: operator.fullName })}
          </div>
        </Link>
      </If>
      <If condition={readOnlyUpdateTime}>
        <div className="font-size-11">
          {I18n.t('CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.UPDATED_AT', {
            updatedAt: moment(readOnlyUpdateTime).format('DD.MM.YYYY HH:mm'),
          })}
        </div>
      </If>
    </Fragment>
  );

  renderServerColumn = ({ accountType, platformType }) => (
    <div className="font-weight-700">{platformType} {accountType}</div>
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
      refetchTradingAccountsList,
      modals: {
        tradingAccountChangePasswordModal,
        updateTradingAccountModal,
        changeLeverageModal,
      },
      match: {
        params: {
          id,
        },
      },
    } = this.props;
    const brand = getActiveBrandConfig();

    const dropDownActions = [
      {
        label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
        onClick: () => tradingAccountChangePasswordModal.show({ accountUUID, profileUUID: id, login }),
      },
      {
        label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.RENAME'),
        onClick: () => updateTradingAccountModal.show({
          accountUUID,
          profileUUID: id,
          onSuccess: refetchTradingAccountsList,
        }),
      },
    ];

    if (brand[`leveragesChangingRequest${platformType}`].length) {
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
          refetchTradingAccountsList,
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
      isLoading,
      tradingAccounts,
      permission: { permissions: currentPermissions },
    } = this.props;

    const updatePasswordPermission = (new Permissions(permissions.TRADING_ACCOUNT.UPDATE_PASSWORD))
      .check(currentPermissions);

    return (
      <div className="tab-wrapper">
        <Grid
          isLoading={isLoading}
          data={tradingAccounts}
          headerStickyFromTop={189}
          withRowsHover
          withNoResults={!isLoading && tradingAccounts.length === 0}
        >
          <GridColumn
            key="tradingAcc"
            name="tradingAcc"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.TRADING_ACC')}
            render={this.renderTradingAccountColumn}
          />
          <GridColumn
            key="login"
            name="login"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.LOGIN')}
            render={this.renderLoginColumn}
          />
          <GridColumn
            key="balance"
            name="balance"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.BALANCE/EQUITY')}
            render={this.renderBalanceColumn}
          />
          <GridColumn
            key="credit"
            name="credit"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.CREDIT')}
            render={this.renderCreditColumn}
          />
          <GridColumn
            key="leverage"
            name="leverage"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.LEVERAGE')}
            render={this.renderLeverageColumn}
          />
          <GridColumn
            key="tradingStatus"
            name="tradingStatus"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.TRADING_STATUS')}
            render={this.renderTradingStatusColumn}
          />
          <GridColumn
            key="server"
            name="server"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.SERVER')}
            render={this.renderServerColumn}
          />
          <If condition={updatePasswordPermission}>
            <GridColumn
              key="actions"
              name="actions"
              headerStyle={{ width: '5%' }}
              render={this.renderActionsColumn}
            />
          </If>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withPermission,
  withNotifications,
  withModals({
    tradingAccountChangePasswordModal: TradingAccountChangePasswordModal,
    updateTradingAccountModal: UpdateTradingAccountModal,
    changeLeverageModal: ChangeLeverageModal,
  }),
  withRequests({
    updateTradingAccount: updateTradingAccountMutation,
    approveChangingLeverage: approveChangingLeverageMutation,
    rejectChangingLeverage: rejectChangingLeverageMutation,
  }),
)(TradingAccountsGrid);
