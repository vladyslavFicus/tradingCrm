import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import GridView, { GridViewColumn } from 'components/GridView';
import TabHeader from 'components/TabHeader';
import history from 'router/history';
import FilterForm from './FilterForm';
import { columns } from '../constants';

class TradingActivity extends Component {
  static propTypes = {
    tradingAccounts: PropTypes.shape({
      tradingAccount: PropTypes.object,
    }).isRequired,
    tradingActivity: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      clientTradingActivity: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.tradingActivity),
      }),
    }).isRequired,
    operators: PropTypes.object.isRequired,
    modals: PropTypes.shape({
      changeOriginalAgentModal: PropTypes.modalType,
    }).isRequired,
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

  handlePageChanged = () => {
    const {
      tradingActivity: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleFilterReset = () => {
    history.replace({
      query: { filters: {} },
    });
  }

  handleFiltersChanged = (filters = {}) => {
    history.replace({
      query: {
        filters: {
          ...filters,
          ...filters.loginIds && { loginIds: filters.loginIds },
        },
      },
    });
  }

  showChangeOriginalAgentModal = (tradeId, agentId) => {
    const { tradingActivity, modals: { changeOriginalAgentModal } } = this.props;

    changeOriginalAgentModal.show({
      tradeId,
      agentId,
      onSuccess: tradingActivity.refetch,
    });
  }

  render() {
    const {
      tradingActivity,
      tradingActivity: { loading, variables },
      tradingAccounts,
      tradingAccounts: { loading: tradingAccountsLoading },
      operators,
    } = this.props;

    const clientTradingActivity = get(tradingActivity, 'clientTradingActivity.data') || { content: [] };
    const accounts = get(tradingAccounts, 'tradingAccount') || [];
    const error = get(tradingActivity, 'clientTradingActivity.error');

    return (
      <Fragment>
        <TabHeader title={I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.TRADING_ACTIVITY')} />
        <FilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={tradingAccountsLoading || false}
          accounts={accounts}
          operators={operators}
          initialValues={{ tradeType: variables.tradeType }}
        />
        <div className="tab-wrapper">
          <GridView
            dataSource={clientTradingActivity.content}
            onPageChange={this.handlePageChanged}
            last={clientTradingActivity.last}
            showNoResults={!!error || (!loading && clientTradingActivity.totalElements === 0)}
            lazyLoad
          >
            {columns(this.showChangeOriginalAgentModal).map(({ name, header, render }) => (
              <GridViewColumn
                key={name}
                name={name}
                header={header}
                render={render}
              />
            ))}
          </GridView>
        </div>
      </Fragment>
    );
  }
}

export default TradingActivity;
