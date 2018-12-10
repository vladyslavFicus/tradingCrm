import React, { Component } from 'react';
import { get } from 'lodash';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import history from '../../../../../router/history';
import TransactionsFilterForm from './TransactionsFilterForm';
import columns from './utils';

class View extends Component {
  static propTypes = {
    players: PropTypes.objectOf(PropTypes.userProfile).isRequired,
    transactions: PropTypes.pageableState(PropTypes.paymentEntity).isRequired,
    filters: PropTypes.shape({
      data: PropTypes.shape({
        paymentMethods: PropTypes.arrayOf(PropTypes.paymentMethod).isRequired,
        statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    }).isRequired,
    fetchEntities: PropTypes.func.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    fetchPlayerProfile: PropTypes.func.isRequired,
    loadPaymentStatuses: PropTypes.func.isRequired,
    onChangePaymentStatus: PropTypes.func.isRequired,
    resetAll: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    exportEntities: PropTypes.func.isRequired,
    fetchPlayerMiniProfile: PropTypes.func.isRequired,
    auth: PropTypes.shape({
      brandId: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
    }).isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    clientPayments: PropTypes.shape({
      clientPayments: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentEntity),
        error: PropTypes.shape({
          error: PropTypes.any,
        }),
      }),
      loading: PropTypes.bool.isRequired,
      loadMore: PropTypes.func,
      refetch: PropTypes.func,
    }),
  };

  static contextTypes = {
    notes: PropTypes.shape({
      onAddNote: PropTypes.func.isRequired,
      onEditNote: PropTypes.func.isRequired,
      onAddNoteClick: PropTypes.func.isRequired,
      onEditNoteClick: PropTypes.func.isRequired,
      setNoteChangedCallback: PropTypes.func.isRequired,
      hidePopover: PropTypes.func.isRequired,
    }),
  };

  static defaultProps = {
    clientPayments: {
      clientPayments: { content: [] },
      loading: false,
    },
  };

  componentDidMount() {
    // TODO: fetch filters(payment methods) from graphQl
    this.props.fetchFilters();
    this.context.notes.setNoteChangedCallback(this.handleRefresh);
  }

  componentWillUnmount() {
    this.context.notes.setNoteChangedCallback(null);
    this.props.resetAll();
  }

  handleRefresh = () => this.props.clientPayments.refetch();

  handlePageChanged = () => {
    const {
      clientPayments: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleFiltersChanged = (data = {}) => {
    const filters = { ...data };

    if (Array.isArray(filters.statuses)) {
      filters.statuses = filters.statuses.join(',');
    }

    history.replace({ query: { filters } });
  };

  handleFilterReset = () => {
    this.props.resetAll();
    history.replace({});
  };

  // this probably will use in another place
  handleChangePaymentStatus = (action, playerUUID, paymentId, options = {}) => {
    const { onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({ action, playerUUID, paymentId, options })
      .then(this.handleRefresh)
      .then(this.handleCloseModal);
  };

  render() {
    const {
      filters: { data: availableFilters },
      locale,
      currencies,
      clientPayments,
      auth,
      fetchPlayerMiniProfile,
    } = this.props;

    const handleModalActionSuccess = () => clientPayments.refetch();

    const entities = get(clientPayments, 'clientPayments.data') || { content: [] };
    const error = get(clientPayments, 'clientPayments.error');

    return (
      <div className="card">
        <TransactionsFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled
          currencies={currencies}
          {...availableFilters}
          filterByType
        />

        <div className="card-body">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            last={entities.last}
            lazyLoad
            locale={locale}
            showNoResults={!!error || (!clientPayments.loading && entities.content.length === 0)}
          >
            {columns(
              {
                auth,
                fetchPlayerMiniProfile,
              },
              handleModalActionSuccess,
            ).map(({ name, header, render }) => (
              <GridViewColumn
                key={name}
                name={name}
                header={header}
                render={render}
              />
            ))}
          </GridView>
        </div>
      </div>
    );
  }
}

export default View;
