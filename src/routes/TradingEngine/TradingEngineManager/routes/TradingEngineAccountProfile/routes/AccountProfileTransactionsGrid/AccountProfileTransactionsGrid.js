import React, { PureComponent } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import withModals from 'hoc/withModals';
import PropTypes from 'constants/propTypes';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import EditOrderModal from 'routes/TradingEngine/TradingEngineManager/modals/EditOrderModal';
import { EditButton } from 'components/UI';
import AccountProfileOrdersGridFilter from './components/AccountProfileOrdersGridFilter';
import AccountProfileStatistics from '../../components/AccountProfileStatistics';
import { types } from '../../attributes/constants';
import { getTypeColor } from '../../attributes/utils';
import TradingEngineTransactionsQuery from './graphql/TradingEngineTransactionsQuery';
import './AccountProfileTransactionsGrid.scss';

class AccountProfileTransactionsGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    modals: PropTypes.shape({
      editOrderModal: PropTypes.modalType,
    }).isRequired,
    transactionsQuery: PropTypes.query({
      tradingEngineTransactions: PropTypes.pageable(PropTypes.tradingActivity),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  refetchTransactions = () => this.props.transactionsQuery.refetch();

  handlePageChanged = () => {
    const {
      location: {
        state,
      },
      match: {
        params: {
          id,
        },
      },
      transactionsQuery: {
        data,
        loadMore,
        variables,
      },
    } = this.props;

    const currentPage = data?.tradingEngineTransactions?.number || 0;
    const filters = state?.filters || {};
    const size = variables?.args?.page?.size;
    const sorts = state?.sorts;

    loadMore({
      args: {
        accountUuid: id,
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

  render() {
    const {
      location: { state },
      transactionsQuery: {
        data,
        loading,
      },
      modals: {
        editOrderModal,
      },
    } = this.props;

    const { content = [], last = true, totalElements = 0 } = data?.tradingEngineTransactions || {};

    return (
      <div className="AccountProfileTransactionsGrid">
        <div className="card">
          <AccountProfileStatistics totalElements={totalElements} type="TRANSACTIONS" />

          <AccountProfileOrdersGridFilter handleRefetch={this.refetchTransactions} />

          <div>
            <Table
              stickyFromTop={152}
              items={content}
              loading={loading}
              hasMore={!last}
              sorts={state?.sorts}
              onSort={this.handleSort}
              onMore={this.handlePageChanged}
            >
              <Column
                sortBy="transaction"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.TRANSACTIONS.GRID.TRANSACTION')}
                render={({ id }) => (
                  <div
                    className="AccountProfileTransactionsGrid__uuid"
                    onClick={() => editOrderModal.show({
                      id,
                      onSuccess: () => this.refetchOrders(),
                    })}
                  >
                    <div className="AccountProfileTransactionsGrid__cell-value">
                      <Uuid
                        uuid={`${id}`}
                        uuidPrefix="TR"
                      />
                      <EditButton className="AccountProfileTransactionsGrid__edit-button" />
                    </div>
                  </div>
                )}
              />
              <Column
                sortBy="type"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.TRANSACTIONS.GRID.TYPE')}
                render={({ type }) => (
                  <div
                    className={classNames(
                      getTypeColor(types.find(item => item.value === type).value),
                      'AccountProfileTransactionsGrid__cell-value',
                    )}
                  >
                    {I18n.t(types.find(item => item.value === type).label)}
                  </div>
                )}
              />
              <Column
                sortBy="amount"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.TRANSACTIONS.GRID.AMOUNT')}
                render={({ amount }) => <div className="AccountProfileTransactionsGrid__cell-value">{amount}</div>}
              />
              <Column
                sortBy="time"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.TRANSACTIONS.GRID.TIME')}
                render={({ createdAt }) => (
                  <div className="AccountProfileTransactionsGrid__cell-value">
                    {moment.utc(createdAt).local().format('DD.MM.YYYY')}
                  </div>
                )}
              />
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withModals({
    editOrderModal: EditOrderModal,
  }),
  withRequests({
    transactionsQuery: TradingEngineTransactionsQuery,
  }),
)(AccountProfileTransactionsGrid);
