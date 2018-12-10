import React, { Component, Fragment } from 'react';
import { SubmissionError } from 'redux-form';
import { get } from 'lodash';
import PropTypes from '../../../../../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../../../../../components/GridView';
import { targetTypes } from '../../../../../../../../../constants/note';
import history from '../../../../../../../../../router/history';
import TransactionsFilterForm from './TransactionsFilterForm';
import columns from './utils';

class Payments extends Component {
  static propTypes = {
    transactions: PropTypes.pageableState(PropTypes.paymentEntity).isRequired,
    filters: PropTypes.shape({
      data: PropTypes.shape({
        paymentMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
        statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    }).isRequired,
    fetchProfile: PropTypes.func.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    resetAll: PropTypes.func.isRequired,
    manageNote: PropTypes.func.isRequired,
    resetNote: PropTypes.func.isRequired,
    currencyCode: PropTypes.string,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    newPaymentNote: PropTypes.noteEntity,
    playerProfile: PropTypes.userProfile,
    playerLimits: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.playerLimitEntity).isRequired,
      deposit: PropTypes.shape({
        locked: PropTypes.bool.isRequired,
        canUnlock: PropTypes.bool.isRequired,
      }).isRequired,
      withdraw: PropTypes.shape({
        locked: PropTypes.bool.isRequired,
        canUnlock: PropTypes.bool.isRequired,
      }).isRequired,
      error: PropTypes.object,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number,
    }).isRequired,
    locale: PropTypes.string.isRequired,
    fetchActiveBonus: PropTypes.func.isRequired,
    addPayment: PropTypes.func.isRequired,
    clientPayments: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      loadMore: PropTypes.func.isRequired,
      clientPaymentsByUuid: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentEntity),
        error: PropTypes.object,
      }),
    }).isRequired,
    modals: PropTypes.shape({
      addPayment: PropTypes.modalType,
    }).isRequired,
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    setRenderActions: PropTypes.func.isRequired,
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
  };

  static defaultProps = {
    newPaymentNote: null,
    currencyCode: null,
    playerProfile: {},
  };

  async componentDidMount() {
    const {
      context: {
        registerUpdateCacheListener,
        setNoteChangedCallback,
        setRenderActions,
      },
      constructor: { name },
      handleRefresh,
      handleOpenAddPaymentModal,
      props: {
        match: { params: { id: playerUUID } },
        fetchFilters,
      },
    } = this;

    handleRefresh();
    registerUpdateCacheListener(name, handleRefresh);
    fetchFilters(playerUUID);
    setNoteChangedCallback(handleRefresh);

    setRenderActions(() => (
      <button className="btn btn-sm btn-primary-outline" onClick={handleOpenAddPaymentModal}>
        + Add transaction
      </button>
    ));
  }

  componentWillUnmount() {
    const {
      context: {
        unRegisterUpdateCacheListener,
        setNoteChangedCallback,
        setRenderActions,
      },
      constructor: { name },
      props: { resetAll },
    } = this;

    resetAll();
    setRenderActions(null);
    setNoteChangedCallback(null);
    unRegisterUpdateCacheListener(name);
  }

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.onEditNoteClick(target, note, { placement: 'left' });
    } else {
      this.context.onAddNoteClick(data.paymentId, targetTypes.PAYMENT)(target, {
        placement: 'left',
        id: data.paymentId,
      });
    }
  };

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

  handleChangePaymentStatus = (action, playerUUID, paymentId, options = {}) => {
    const { onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({
      action, playerUUID, paymentId, options,
    })
      .then(this.handleRefresh)
      .then(this.handleCloseModal);
  };

  handleFilterReset = () => {
    this.props.resetAll();
    history.replace({});
  };

  handleAddPayment = async (inputParams) => {
    const {
      addPayment,
      match: { params: { id: uuid } },
      currencyCode,
      clientPayments: { refetch },
      playerProfile: {
        country,
        languageCode: language,
        firstName,
        lastName,
      },
      fetchProfile,
      modals: { addPayment: modal },
    } = this.props;

    const variables = {
      ...inputParams,
      language,
      currency: currencyCode,
      playerProfile: {
        country,
        firstName,
        lastName,
        uuid,
      },
    };
    const { data: { payment: { createClientPayment: { error } } } } = await addPayment({ variables });

    if (error) {
      throw new SubmissionError({ _error: [error] });
    } else {
      await Promise.all([
        refetch(),
        fetchProfile(uuid),
      ]);
      modal.hide();
    }
  };

  handleOpenAddPaymentModal = () => {
    const {
      modals: { addPayment },
      manageNote,
      playerProfile,
    } = this.props;

    addPayment.show({
      onSubmit: this.handleAddPayment,
      playerProfile,
      onManageNote: manageNote,
    });
  };

  render() {
    const {
      filters: { data: availableFilters },
      playerProfile,
      locale,
      clientPayments: {
        loading,
        clientPaymentsByUuid,
        refetch,
      },
    } = this.props;

    const entities = get(clientPaymentsByUuid, 'data') || { content: [] };
    const error = get(clientPaymentsByUuid, 'error');

    const handleModalActionSuccess = () => refetch();

    return (
      <Fragment>
        <TransactionsFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          currencyCode={playerProfile.currencyCode}
          {...availableFilters}
        />

        <div className="tab-wrapper">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            last={entities.last}
            lazyLoad
            locale={locale}
            showNoResults={!!error || (!loading && entities.content.length === 0)}
          >
            {columns(handleModalActionSuccess).map(({ name, header, render }) => (
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

export default Payments;
