import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../components/GridView';
import Amount from '../../../../../components/Amount';
import {
  types as paymentTypes,
  methodsLabels,
  typesLabels,
  typesProps,
  statuses as paymentsStatuses,
} from '../../../../../constants/payment';
import { shortify } from '../../../../../utils/uuid';
import StatusHistory from '../../../../../components/TransactionStatusHistory';
import { targetTypes } from '../../../../../constants/note';
import NoteButton from '../../../../../components/NoteButton';
import TransactionsFilterForm from './TransactionsFilterForm';
import PaymentDetailModal from './PaymentDetailModal';
import PaymentActionReasonModal from './PaymentActionReasonModal';
import PaymentAddModal from './PaymentAddModal';
import { UncontrolledTooltip } from '../../../../../components/Reactstrap/Uncontrolled';
import Uuid from '../../../../../components/Uuid';

const MODAL_PAYMENT_DETAIL = 'payment-detail';
const MODAL_PAYMENT_ACTION_REASON = 'payment-action-reason';
const MODAL_PAYMENT_ADD = 'payment-add';
const defaultModalState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    transactions: PropTypes.pageableState(PropTypes.paymentEntity).isRequired,
    filters: PropTypes.shape({
      data: PropTypes.shape({
        paymentMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    }).isRequired,
    fetchEntities: PropTypes.func.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    resetAll: PropTypes.func.isRequired,
    loadPaymentStatuses: PropTypes.func.isRequired,
    onChangePaymentStatus: PropTypes.func.isRequired,
    loadPaymentAccounts: PropTypes.func.isRequired,
    addPayment: PropTypes.func.isRequired,
    manageNote: PropTypes.func.isRequired,
    resetNote: PropTypes.func.isRequired,
    currencyCode: PropTypes.string.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    newPaymentNote: PropTypes.noteEntity,
    playerProfile: PropTypes.userProfile.isRequired,
    paymentActionReasons: PropTypes.paymentActionReasons,
  };
  static defaultProps = {
    newPaymentNote: null,
    paymentActionReasons: [],
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
    refreshPinnedNotes: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    cacheChildrenComponent: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
    page: 0,
    modal: defaultModalState,
  };

  componentWillMount() {
    this.context.cacheChildrenComponent(this);
  }

  componentDidMount() {
    const { params: { id: playerUUID }, fetchFilters } = this.props;

    fetchFilters(playerUUID);
    this.handleRefresh();
    this.context.setNoteChangedCallback(this.handleRefresh);
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
    this.context.cacheChildrenComponent(null);
    this.props.resetAll();
  }

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.onEditNoteClick(target, note, { placement: 'left' });
    } else {
      this.context.onAddNoteClick(data.paymentId, targetTypes.PAYMENT)(target, { placement: 'left' });
    }
  };

  handleRefresh = () => this.props.fetchEntities(
    this.props.params.id, {
      ...this.state.filters,
      page: this.state.page,
    },
  );

  handlePageChanged = (page) => {
    if (!this.props.transactions.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleFiltersChanged = (data = {}) => {
    const filters = { ...data };

    if (Array.isArray(filters.statuses)) {
      filters.statuses = filters.statuses.join(',');
    }

    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleChangePaymentStatus = (action, playerUUID, paymentId, options = {}) => {
    const { onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({ action, playerUUID, paymentId, options })
      .then(this.handleRefresh)
      .then(this.handleCloseModal);
  };

  handleFilterReset = () => {
    this.props.resetAll();
    this.setState({ filters: {}, page: 0 });
  };

  handleAddPayment = async (inputParams) => {
    const {
      addPayment,
      params: { id: playerUUID },
      currencyCode,
      resetNote,
      newPaymentNote: unsavedNote,
    } = this.props;

    const params = {
      ...inputParams,
      currency: currencyCode,
    };

    if (inputParams.type !== paymentTypes.Withdraw) {
      delete params.paymentMethod;
    }

    const action = await addPayment(playerUUID, params);

    if (action && action.error) {
      throw new SubmissionError({ _error: action.payload.response.error });
    } else {
      if (unsavedNote) {
        await this.context.onAddNote({ ...unsavedNote, targetUUID: action.payload.paymentId });
        if (unsavedNote.pinned) {
          this.context.refreshPinnedNotes();
        }
      }

      resetNote();
      this.handleRefresh();
      this.handleCloseModal();
    }

    return action;
  };

  handleOpenAddPaymentModal = () => {
    this.setState({ modal: { name: MODAL_PAYMENT_ADD } });
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

  renderTransactionId = (data) => {
    const showPaymentDetails =
      (data.paymentType === paymentTypes.Withdraw && data.status === paymentsStatuses.PENDING) ||
      (data.paymentType === paymentTypes.Deposit && data.status === paymentsStatuses.COMPLETED);

    const paymentId = shortify(data.paymentId, 'TA');
    const paymentLink = showPaymentDetails ?
      (
        <span
          className="cursor-pointer"
          onClick={() => this.handleOpenDetailModal({
            payment: data,
          })}
        >
          {paymentId}
        </span>
      ) : paymentId;

    return (
      <div id={`payment-${data.paymentId}`}>
        <div className="font-weight-700">{paymentLink}</div>
        <span className="font-size-10 text-uppercase color-default">
          by <Uuid uuid={data.playerUUID} uuidPrefix={data.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null} />
        </span>
      </div>
    );
  };

  renderType = (data) => {
    const label = typesLabels[data.paymentType] || data.paymentType;
    const props = typesProps[data.paymentType] || {};

    return (
      <div>
        <div {...props}> {label} </div>
        <span className="font-size-10 text-uppercase color-default">
          {data.paymentSystemRefs.map((SystemRef, index) => (
            <div key={`${SystemRef}-${index}`}>{SystemRef}</div>
          ))}
        </span>
      </div>
    );
  };

  renderAmount = (data) => {
    const negativeOperation = [paymentTypes.Withdraw, paymentTypes.Confiscate].indexOf(data.paymentType) !== -1;
    return (
      <div className={classNames('font-weight-700', { 'color-danger': negativeOperation })}>
        {negativeOperation && '-'}<Amount {...data.amount} />
      </div>
    );
  };

  renderDateTime = data => (
    <div>
      <div className="font-weight-700">
        {moment(data.creationTime).format('DD.MM.YYYY')}
      </div>
      <span className="font-size-10 color-default">
        {moment(data.creationTime).format('HH:mm:ss')}
      </span>
    </div>
  );

  renderIP = (data) => {
    if (!data.country) {
      return data.country;
    }

    const id = `payment-ip-${data.paymentId}`;

    return (
      <span>
        <i id={id} className={`fs-icon fs-${data.country.toLowerCase()}`} />
        <UncontrolledTooltip
          placement="bottom"
          target={id}
          delay={{
            show: 350,
            hide: 250,
          }}
        >
          {data.clientIp ? data.clientIp : I18n.t('COMMON.UNAVAILABLE')}
        </UncontrolledTooltip>
      </span>
    );
  };

  renderMethod = data => (
    <div>
      <div className="font-weight-700">
        {methodsLabels[data.paymentMethod] || data.paymentMethod}
      </div>
      <span className="font-size-10">
        <Uuid uuid={data.paymentAccount} uuidPartsCount={2} />
      </span>
    </div>
  );

  renderDevice = (data) => {
    const id = `payment-device-${data.paymentId}`;

    return (
      <div>
        <i
          id={id}
          className={`fa font-size-20 ${data.mobile ? 'fa-mobile' : 'fa-desktop'}`}
        />
        <UncontrolledTooltip
          placement="bottom"
          target={id}
          delay={{
            show: 350,
            hide: 250,
          }}
        >
          {data.userAgent ? data.userAgent : 'User agent not defined'}
        </UncontrolledTooltip>
      </div>
    );
  };

  renderStatus = data => (
    <StatusHistory
      onLoadStatusHistory={() => this.props.loadPaymentStatuses(data.playerUUID, data.paymentId)}
      transaction={data}
    />
  );

  renderActions = data => (
    <NoteButton
      id={`player-transaction-item-note-button-${data.paymentId}`}
      note={data.note}
      onClick={this.handleNoteClick}
      targetEntity={data}
    />
  );

  render() {
    const { modal } = this.state;
    const {
      transactions: { entities },
      filters: { data: availableFilters },
      loadPaymentAccounts,
      manageNote,
      playerProfile,
      newPaymentNote,
    } = this.props;

    return (
      <div className="profile-tab-container">
        <div className="row margin-bottom-20">
          <div className="col-sm-3 col-xs-6">
            <span className="font-size-20">Transactions</span>
          </div>
          <div className="col-sm-9 col-xs-6 text-right">
            <button
              className="btn btn-sm btn-primary-outline"
              onClick={this.handleOpenAddPaymentModal}
            >
              + Add transaction
            </button>
          </div>
        </div>

        <TransactionsFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          currencyCode={playerProfile.currencyCode}
          {...availableFilters}
        />

        <GridView
          tableClassName="table table-hovered data-grid-layout"
          headerClassName=""
          dataSource={entities.content}
          onPageChange={this.handlePageChanged}
          activePage={entities.number + 1}
          totalPages={entities.totalPages}
          rowClassName={data => (data.amountBarrierReached ? 'highlighted-row' : '')}
          lazyLoad
        >
          <GridColumn
            name="paymentId"
            header="Transaction"
            headerClassName="text-uppercase"
            render={this.renderTransactionId}
          />
          <GridColumn
            name="paymentType"
            header="Type"
            headerClassName="text-uppercase"
            render={this.renderType}
          />
          <GridColumn
            name="amount"
            header="Amount"
            headerClassName="text-uppercase"
            render={this.renderAmount}
          />
          <GridColumn
            name="creationTime"
            header="DATE & TIME"
            headerClassName="text-uppercase"
            render={this.renderDateTime}
          />
          <GridColumn
            name="country"
            header="Ip"
            headerClassName="text-uppercase text-center"
            className="text-uppercase text-center"
            render={this.renderIP}
          />
          <GridColumn
            name="paymentMethod"
            header="Method"
            headerClassName="text-uppercase"
            render={this.renderMethod}
          />
          <GridColumn
            name="mobile"
            header="Device"
            headerClassName="text-uppercase text-center"
            className="text-center"
            render={this.renderDevice}
          />
          <GridColumn
            name="status"
            header="Status"
            headerClassName="text-uppercase"
            className="text-uppercase"
            render={this.renderStatus}
          />
          <GridColumn
            name="actions"
            header=""
            render={this.renderActions}
          />
        </GridView>

        {
          modal.name === MODAL_PAYMENT_DETAIL &&
          <PaymentDetailModal
            {...modal.params}
            isOpen
            playerProfile={playerProfile}
            onClose={this.handleCloseModal}
            onChangePaymentStatus={this.handleChangePaymentStatus}
            onAskReason={this.handleAskReason}
          />
        }

        {
          modal.name === MODAL_PAYMENT_ACTION_REASON &&
          <PaymentActionReasonModal
            {...modal.params}
            isOpen
            onClose={this.handleCloseModal}
            onChangePaymentStatus={this.handleChangePaymentStatus}
          />
        }

        {
          modal.name === MODAL_PAYMENT_ADD &&
          <PaymentAddModal
            {...modal.params}
            note={newPaymentNote}
            playerProfile={playerProfile}
            onClose={this.handleCloseModal}
            onLoadPaymentAccounts={() => loadPaymentAccounts(playerProfile.playerUUID)}
            onSubmit={this.handleAddPayment}
            onManageNote={manageNote}
          />
        }
      </div>
    );
  }
}

export default View;
