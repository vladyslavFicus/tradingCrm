import React, { PureComponent, Fragment } from 'react';
import { compose, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { withPermission } from 'providers/PermissionsProvider';
import { updateTradingAccountMutation } from 'graphql/mutations/tradingAccount';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import PropTypes from 'constants/propTypes';
import { accountTypesLabels } from 'constants/accountTypes';
import { withModals } from 'components/HighOrder';
import GridView, { GridViewColumn } from 'components/GridView';
import ActionsDropDown from 'components/ActionsDropDown';
import Badge from 'components/Badge';
import TradingAccountChangePasswordModal from './TradingAccountChangePasswordModal';

class TradingAccountsGrid extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      TradingAccountChangePasswordModal: PropTypes.modalType,
    }).isRequired,
    tradingAccounts: PropTypes.arrayOf(PropTypes.mt4User).isRequired,
    updateTradingAccount: PropTypes.func.isRequired,
    refetchTradingAccountsList: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
    profileUuid: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  handleSetTradingAccountReadonly = (accountUUID, readOnly) => () => {
    const {
      profileUuid,
      updateTradingAccount,
      refetchTradingAccountsList,
    } = this.props;

    updateTradingAccount({
      variables: {
        accountUUID,
        profileId: profileUuid,
        readOnly,
      },
    }).then(refetchTradingAccountsList);
  };

  renderTradingAccountColumn = ({ name, login, group, accountType, platformType, archived }) => (
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
        {platformType}ID - {login}
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

  renderLeverageColumn = ({ leverage }) => (
    <div className="font-weight-700">{leverage}</div>
  );

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

  renderActionsColumn = ({ readOnly, accountType, archived, accountUUID, profileUUID, login }) => {
    const { modals: { tradingAccountChangePasswordModal } } = this.props;

    const dropDownActions = [{
      label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
      onClick: () => tradingAccountChangePasswordModal.show({ accountUUID, profileUUID, login }),
    }];

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
        <GridView
          tableClassName="table-hovered"
          dataSource={tradingAccounts}
          showNoResults={!isLoading && tradingAccounts.length === 0}
        >
          <GridViewColumn
            key="tradingAcc"
            name="tradingAcc"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.TRADING_ACC')}
            render={this.renderTradingAccountColumn}
          />
          <GridViewColumn
            key="balance"
            name="balance"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.BALANCE/EQUITY')}
            render={this.renderBalanceColumn}
          />
          <GridViewColumn
            key="credit"
            name="credit"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.CREDIT')}
            render={this.renderCreditColumn}
          />
          <GridViewColumn
            key="leverage"
            name="leverage"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.LEVERAGE')}
            render={this.renderLeverageColumn}
          />
          <GridViewColumn
            key="tradingStatus"
            name="tradingStatus"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.TRADING_STATUS')}
            render={this.renderTradingStatusColumn}
          />
          <GridViewColumn
            key="server"
            name="server"
            header={I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.SERVER')}
            render={this.renderServerColumn}
          />
          <If condition={updatePasswordPermission}>
            <GridViewColumn
              key="actions"
              name="actions"
              headerStyle={{ width: '5%' }}
              render={this.renderActionsColumn}
            />
          </If>
        </GridView>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withModals({
    tradingAccountChangePasswordModal: TradingAccountChangePasswordModal,
  }),
  graphql(updateTradingAccountMutation, { name: 'updateTradingAccount' }),
)(TradingAccountsGrid);
