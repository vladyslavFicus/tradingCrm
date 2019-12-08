import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import history from 'router/history';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import GridView, { GridViewColumn } from 'components/GridView';
import ActionsDropDown from 'components/ActionsDropDown';
import ListFilterForm from 'components/ListFilterForm';
import Permissions from 'utils/permissions';
import columns, { actionColumn } from './utils';
import filterFields from './filterFields';

class View extends PureComponent {
  static propTypes = {
    newProfile: PropTypes.newProfile.isRequired,
    getTradingAccount: PropTypes.shape({
      playerProfile: PropTypes.shape({
        mt4Users: PropTypes.arrayOf(PropTypes.mt4User),
      }),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      tradingAccountAddModal: PropTypes.modalType,
      tradingAccountChangePasswordModal: PropTypes.modalType,
    }).isRequired,
    updateTradingAccount: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
  };

  static contextTypes = {
    setRenderActions: PropTypes.func.isRequired,
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      context: {
        setRenderActions,
        registerUpdateCacheListener,
        constructor: { name },
      },
    } = this;

    registerUpdateCacheListener(name, this.props.newProfile.refetch);

    setRenderActions(() => (
      <PermissionContent permissions={permissions.TRADING_ACCOUNT.CREATE}>
        <button type="button" className="btn btn-default-outline" onClick={this.showTradingAccountAddModal}>
          {I18n.t('CLIENT_PROFILE.ACCOUNTS.ADD_TRADING_ACC')}
        </button>
      </PermissionContent>
    ));
  }

  componentWillUnmount() {
    const {
      context: { unRegisterUpdateCacheListener },
      constructor: { name },
    } = this;

    unRegisterUpdateCacheListener(name);
  }

  showTradingAccountAddModal = () => {
    this.props.modals.tradingAccountAddModal.show({
      profileId: get(this.props.newProfile, 'newProfile.data.uuid'),
      onConfirm: this.props.getTradingAccount.refetch,
    });
  };

  handleSetTradingAccountReadonly = (accountUUID, readOnly) => () => this.props.updateTradingAccount({
    variables: {
      profileId: get(this.props.newProfile, 'newProfile.data.uuid'),
      accountUUID,
      readOnly,
    },
  }).then(() => this.props.getTradingAccount.refetch());

  renderActions = ({ readOnly, accountType, archived, accountUUID, profileUUID, login }) => {
    const items = [
      {
        label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
        onClick: () => this.props.modals.tradingAccountChangePasswordModal.show({ accountUUID, profileUUID, login }),
      },
    ];

    if (accountType !== 'DEMO') {
      items.push({
        label: I18n.t(`CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.${!readOnly ? 'DISABLE' : 'ENABLE'}`),
        onClick: this.handleSetTradingAccountReadonly(accountUUID, !readOnly),
      });
    }

    if (!archived) {
      return (<ActionsDropDown items={items} />);
    }

    return null;
  };

  handleFiltersChanged = (filters = {}) => {
    history.replace({
      query: {
        filters: {
          ...filters,
          accountType: filters.accountType || '',
        },
      },
    });
  };

  handleFilterReset = () => history.replace({ query: { filters: {} } });

  render() {
    const {
      getTradingAccount,
      permission: { permissions: currentPermissions },
    } = this.props;

    const tradingAccounts = get(getTradingAccount, 'tradingAccount') || [];

    const updatePassPermission = (new Permissions(permissions.TRADING_ACCOUNT.UPDATE_PASSWORD))
      .check(currentPermissions);

    return (
      <Fragment>
        <ListFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          initialValues={{ accountType: getTradingAccount.variables.accountType }}
          fields={filterFields()}
        />
        <div className="tab-wrapper">
          <GridView
            tableClassName="table-hovered"
            dataSource={tradingAccounts}
            showNoResults={!getTradingAccount.loading && tradingAccounts.length === 0}
          >
            {[
              ...columns,
              ...(updatePassPermission ? [actionColumn(this.renderActions)] : []),
            ].map(({ name, header, headerStyle, render }) => (
              <GridViewColumn
                key={name}
                name={name}
                header={header}
                headerStyle={headerStyle}
                render={render}
              />
            ))}
          </GridView>
        </div>
      </Fragment>
    );
  }
}

export default View;
