import React, { PureComponent, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
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
    playerProfile: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      playerProfile: PropTypes.shape({
        mt4Users: PropTypes.arrayOf(PropTypes.mt4User),
      }),
    }).isRequired,
    locale: PropTypes.string.isRequired,
    modals: PropTypes.shape({
      tradingAccountAddModal: PropTypes.modalType,
      tradingAccountChangePasswordModal: PropTypes.modalType,
    }).isRequired,
    updateTradingAccount: PropTypes.func.isRequired,
  };

  static contextTypes = {
    setRenderActions: PropTypes.func.isRequired,
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
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

    registerUpdateCacheListener(name, this.props.playerProfile.refetch);

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
    const { playerUUID: profileId } = get(this.props.playerProfile, 'playerProfile.data', {});
    this.props.modals.tradingAccountAddModal.show({
      profileId,
      onConfirm: this.props.playerProfile.refetch,
    });
  };

  handleSetTradingAccountReadonly = (login, isReadOnly) => () => this.props.updateTradingAccount({
    variables: {
      profileId: get(this.props.playerProfile, 'playerProfile.data.playerUUID'),
      login,
      isReadOnly,
    },
  }).then(() => this.props.playerProfile.refetch());

  renderActions = ({ login, isReadOnly, accountType }) => {
    const items = [
      {
        label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
        onClick: () => this.props.modals.tradingAccountChangePasswordModal.show({ login }),
      },
    ];

    if (accountType !== 'DEMO') {
      items.push({
        label: I18n.t(`CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.${!isReadOnly ? 'DISABLE' : 'ENABLE'}`),
        onClick: this.handleSetTradingAccountReadonly(login, !isReadOnly),
      });
    }
    return (<ActionsDropDown items={items} />);
  };

  handleFiltersChanged = (filters = {}) => {
    history.replace({
      query: {
        filters: { ...filters },
      },
    });
  };

  handleFilterReset = () => history.replace({ query: { filters: {} } });

  render() {
    const {
      playerProfile,
      locale,
    } = this.props;
    const { permissions: currentPermissions } = this.context;

    const mt4Users = get(playerProfile, 'playerProfile.data.tradingProfile.mt4Users') || [];
    const updatePassPermission = (new Permissions(permissions.TRADING_ACCOUNT.UPDATE_PASSWORD))
      .check(currentPermissions);

    return (
      <Fragment>
        <ListFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          initialValues={{ accountType: playerProfile.variables.accountType }}
          fields={filterFields()}
        />
        <div className="tab-wrapper">
          <GridView
            tableClassName="table-hovered"
            dataSource={mt4Users}
            locale={locale}
            showNoResults={!playerProfile.loading && mt4Users.length === 0}
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
