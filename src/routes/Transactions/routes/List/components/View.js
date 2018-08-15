import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import TransactionsFilterForm from '../../../components/TransactionsFilterForm';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import PaymentDetailModal from '../../../../../components/PaymentDetailModal';
import PaymentActionReasonModal from '../../../../../components/PaymentActionReasonModal';
import { targetTypes } from '../../../../../constants/note';
import history from '../../../../../router/history';
import columns from './utils';

const MODAL_PAYMENT_DETAIL = 'payment-detail';
const MODAL_PAYMENT_ACTION_REASON = 'payment-action-reason';
const defaultModalState = {
  name: null,
  params: {},
};

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
    paymentActionReasons: PropTypes.paymentActionReasons.isRequired,
    locale: PropTypes.string.isRequired,
    exportEntities: PropTypes.func.isRequired,
    fetchPlayerMiniProfile: PropTypes.func.isRequired,
    auth: PropTypes.shape({
      brandId: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
    }).isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    clientPayments: PropTypes.shape({
      clientPayments: PropTypes.object,
      loading: PropTypes.bool.isRequired,
      loadMore: PropTypes.func.isRequired,
      refetch: PropTypes.func.isRequired,
    }).isRequired,
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

  state = {
    modal: { ...defaultModalState },
  };

  componentDidMount() {
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

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.notes.onEditNoteClick(target, note, { placement: 'left' });
    } else {
      this.context.notes.onAddNoteClick(
        target,
        { playerUUID: data.playerUUID, targetUUID: data.paymentId, targetType: targetTypes.PAYMENT },
        { placement: 'left' }
      );
    }
  };

  handleChangePaymentStatus = (action, playerUUID, paymentId, options = {}) => {
    const { onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({ action, playerUUID, paymentId, options })
      .then(this.handleRefresh)
      .then(this.handleCloseModal);
  };

  handleAskReason = (data) => {
    this.handleCloseModal();

    return this.handleOpenReasonModal({
      ...data,
      reasons: this.props.paymentActionReasons[data.action] || [],
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

  handleOpenDetailModal = async (params) => {
    const { players } = this.props;
    let playerProfile = players[params.payment.playerUUID];

    if (!playerProfile) {
      const action = await this.props.fetchPlayerProfile(params.payment.playerUUID);
      playerProfile = action && !action.error
        ? action.payload
        : null;
    }

    this.setState({
      modal: {
        ...defaultModalState,
        name: MODAL_PAYMENT_DETAIL,
        params: {
          ...params,
          playerProfile,
        },
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
    const {
      filters: { data: availableFilters },
      locale,
      currencies,
      clientPayments,
      auth,
      fetchPlayerMiniProfile,
      loadPaymentStatuses,
    } = this.props;

    const entities = get(clientPayments, 'clientPayments', { content: [] });
    const { modal } = this.state;

    return (
      <div className="card">
        <div className="card-heading">
          <span className="font-size-20" id="transactions-list-header">
            {I18n.t('COMMON.PAYMENTS')}
          </span>
        </div>

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
            showNoResults={!clientPayments.loading && entities.content.length === 0}
          >
            {columns(
              {
                auth,
                fetchPlayerMiniProfile,
                loadPaymentStatuses,
              },
              this.handleOpenDetailModal,
            ).map(({ name, header, render }) => (
              <GridViewColumn
                key={name}
                name={name}
                header={header}
                render={render}
              />
            ))}
          </GridView>
          {
            modal.name === MODAL_PAYMENT_DETAIL &&
            <PaymentDetailModal
              {...modal.params}
              isOpen
              onClose={this.handleCloseModal}
              onChangePaymentStatus={this.handleChangePaymentStatus}
              onAskReason={this.handleAskReason}
              onNoteClick={this.handleNoteClick}
            />
          }

          {
            modal.name === MODAL_PAYMENT_ACTION_REASON &&
            <PaymentActionReasonModal
              {...modal.params}
              onClose={this.handleCloseModal}
              onChangePaymentStatus={this.handleChangePaymentStatus}
              onNoteClick={this.handleNoteClick}
            />
          }
        </div>
      </div>
    );
  }
}

export default View;
