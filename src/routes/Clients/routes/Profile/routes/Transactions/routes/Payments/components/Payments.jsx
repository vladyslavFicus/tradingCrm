import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { get } from 'lodash';
import PropTypes from '../../../../../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../../../../../components/GridView';
import { targetTypes } from '../../../../../../../../../constants/note';
import TransactionsFilterForm from './TransactionsFilterForm';
import PaymentDetailModal from '../../../../../../../../../components/PaymentDetailModal';
import PaymentActionReasonModal from '../../../../../../../../../components/PaymentActionReasonModal';
import PaymentAddModal from './PaymentAddModal';
import history from '../../../../../../../../../router/history';
import columns from './utils';

const MODAL_PAYMENT_DETAIL = 'payment-detail';
const MODAL_PAYMENT_ACTION_REASON = 'payment-action-reason';
const MODAL_PAYMENT_ADD = 'payment-add';
const defaultModalState = {
  name: null,
  params: {},
};

class Payments extends Component {
  static propTypes = {
    transactions: PropTypes.pageableState(PropTypes.paymentEntity).isRequired,
    filters: PropTypes.shape({
      data: PropTypes.shape({
        paymentMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
        statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    }).isRequired,
    fetchEntities: PropTypes.func.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    resetAll: PropTypes.func.isRequired,
    loadPaymentStatuses: PropTypes.func.isRequired,
    onChangePaymentStatus: PropTypes.func.isRequired,
    loadPaymentAccounts: PropTypes.func.isRequired,
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
    paymentActionReasons: PropTypes.paymentActionReasons,
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
      clientPaymentsByUuid: PropTypes.pageable(PropTypes.paymentEntity),
    }).isRequired,
  };
  static defaultProps = {
    newPaymentNote: null,
    currencyCode: null,
    playerProfile: {},
    paymentActionReasons: {},
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

  state = {
    modal: defaultModalState,
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
      handleOpenDetailModal,
      handleCloseModal,
      handleOpenAddPaymentModal,
      props: {
        match: { params: { id: playerUUID, paymentUUID } },
        fetchFilters,
        fetchEntities,
        location,
      },
    } = this;

    handleRefresh();
    registerUpdateCacheListener(name, handleRefresh);
    fetchFilters(playerUUID);
    setNoteChangedCallback(handleRefresh);

    if (paymentUUID) {
      const action = await fetchEntities(playerUUID, { keyword: paymentUUID });

      if (action && !action.error && action.payload.content.length > 0) {
        handleOpenDetailModal({
          payment: action.payload.content[0],
          onClose: () => {
            handleCloseModal();
            history.replace(location.pathname.replace(`/${paymentUUID}`, ''));
          },
        });
      }
    }

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
      match: { params: { id: playerUUID } },
      currencyCode,
    } = this.props;

    const variables = {
      ...inputParams,
      playerUUID,
      currency: currencyCode,
    };
    const action = await addPayment({ variables });

    if (action.data.payment.createClientPayment.error) {
      throw new SubmissionError({ _error: [action.data.payment.createClientPayment.error.error] });
    } else {
      await this.props.clientPayments.refetch();
      this.handleCloseModal();
    }
  };

  handleOpenAddPaymentModal = () => {
    this.setState({ modal: { name: MODAL_PAYMENT_ADD } });
  };

  handleAskReason = (data) => {
    this.handleCloseModal();

    return this.handleOpenReasonModal({
      ...data,
      reasons: this.props.paymentActionReasons[data.action] || {},
    });
  };

  handleOpenReasonModal = (params) => {
    this.setState({
      modal: {
        ...defaultModalState,
        name: MODAL_PAYMENT_ACTION_REASON,
        params,
      },
    });
  };

  handleOpenDetailModal = (params) => {
    this.setState({
      modal: {
        ...defaultModalState,
        name: MODAL_PAYMENT_DETAIL,
        params,
      },
    });
  };

  handleCloseModal = (callback) => {
    this.setState({ modal: { ...defaultModalState } }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  render() {
    const { modal } = this.state;
    const {
      filters: { data: availableFilters },
      loadPaymentAccounts,
      manageNote,
      playerProfile,
      playerLimits,
      locale,
      loadPaymentStatuses,
      clientPayments: {
        loading,
      },
    } = this.props;

    const mt4Users = get(playerProfile, 'tradingProfile.mt4Users');
    const entities = get(this.props.clientPayments, 'clientPaymentsByUuid') || { content: [] };

    return (
      <div>

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
            showNoResults={!loading && entities.content.length === 0}
          >
            {columns(
              this.handleOpenDetailModal,
              loadPaymentStatuses
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
        {
          modal.name === MODAL_PAYMENT_DETAIL &&
          <PaymentDetailModal
            playerProfile={playerProfile}
            onClose={this.handleCloseModal}
            onChangePaymentStatus={this.handleChangePaymentStatus}
            onAskReason={this.handleAskReason}
            onNoteClick={this.handleNoteClick}
            {...modal.params}
          />
        }

        {
          modal.name === MODAL_PAYMENT_ACTION_REASON &&
          <PaymentActionReasonModal
            {...modal.params}
            onClose={this.handleCloseModal}
            onChangePaymentStatus={this.handleChangePaymentStatus}
            onNoteClick={this.handleNoteClick}
            onSubmit={this.handleChangePaymentStatus}
          />
        }

        {
          modal.name === MODAL_PAYMENT_ADD &&
          <PaymentAddModal
            {...modal.params}
            playerProfile={playerProfile}
            onClose={this.handleCloseModal}
            onLoadPaymentAccounts={() => loadPaymentAccounts(playerProfile.playerUUID)}
            onSubmit={this.handleAddPayment}
            onManageNote={manageNote}
            playerLimits={playerLimits}
            mt4Accounts={mt4Users}
          />
        }
      </div>
    );
  }
}

export default Payments;
