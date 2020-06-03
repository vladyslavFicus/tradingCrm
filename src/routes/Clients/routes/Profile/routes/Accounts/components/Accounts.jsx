import React, { PureComponent, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import EventEmitter, { PROFILE_RELOAD } from 'utils/EventEmitter';
import { newProfile as newProfileQuery } from 'graphql/queries/profile';
import { getTradingAccount } from 'graphql/queries/tradingAccount';
import PermissionContent from 'components/PermissionContent';
import TabHeader from 'components/TabHeader';
import ListFilterForm from 'components/ListFilterForm';
import TradingAccountAddModal from './TradingAccountAddModal';
import TradingAccountsGrid from './TradingAccountsGrid';
import filterFields from '../filterFields';

class Accounts extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    modals: PropTypes.shape({
      tradingAccountAddModal: PropTypes.modalType,
    }).isRequired,
    tradingAccountsData: PropTypes.shape({
      tradingAccount: PropTypes.arrayOf(PropTypes.tradingAccount),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    newProfile: PropTypes.newProfile.isRequired,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.onProfileEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.onProfileEvent);
  }

  onProfileEvent = () => {
    this.props.tradingAccountsData.refetch();
  };

  showTradingAccountAddModal = () => {
    const {
      modals: { tradingAccountAddModal },
      newProfile,
      tradingAccountsData,
    } = this.props;

    tradingAccountAddModal.show({
      profileId: get(newProfile, 'newProfile.data.uuid'),
      onConfirm: tradingAccountsData.refetch,
    });
  };

  handleFiltersSubmit = filters => this.props.history.replace({ query: { filters } });

  handleFilterReset = () => this.props.history.replace({ query: { filters: {} } });

  render() {
    const {
      newProfile,
      tradingAccountsData,
      tradingAccountsData: {
        refetch,
        loading,
      },
    } = this.props;

    const tradingAccounts = get(tradingAccountsData, 'tradingAccount') || [];
    const accountType = get(tradingAccountsData, 'variables.accountType') || '';
    const profileUuid = get(newProfile, 'newProfile.data.uuid') || '';

    return (
      <Fragment>
        <TabHeader title={I18n.t('CLIENT_PROFILE.ACCOUNTS.ROUTES.TRADING_ACC')}>
          <PermissionContent permissions={permissions.TRADING_ACCOUNT.CREATE}>
            <button
              type="button"
              className="btn btn-default-outline"
              onClick={this.showTradingAccountAddModal}
            >
              {I18n.t('CLIENT_PROFILE.ACCOUNTS.ADD_TRADING_ACC')}
            </button>
          </PermissionContent>
        </TabHeader>

        <ListFilterForm
          onSubmit={this.handleFiltersSubmit}
          onReset={this.handleFilterReset}
          initialValues={{ accountType }}
          fields={filterFields()}
        />

        <TradingAccountsGrid
          tradingAccounts={tradingAccounts}
          refetchTradingAccountsList={refetch}
          profileUuid={profileUuid}
          isLoading={loading}
        />
      </Fragment>
    );
  }
}

export default compose(
  withModals({
    tradingAccountAddModal: TradingAccountAddModal,
  }),
  graphql(getTradingAccount, {
    options: ({
      match: {
        params: {
          id: uuid,
        },
      },
      location: { query },
    }) => ({
      variables: {
        accountType: 'LIVE',
        ...query && query.filters,
        uuid,
      },
      fetchPolicy: 'network-only',
    }),
    name: 'tradingAccountsData',
  }),
  graphql(newProfileQuery, {
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      variables: {
        playerUUID,
      },
    }),
    name: 'newProfile',
  }),
)(Accounts);
