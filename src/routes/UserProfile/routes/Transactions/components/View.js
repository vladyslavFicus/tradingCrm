import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import GridView, { GridColumn } from '../../../../../components/GridView';
import Amount from '../../../../../components/Amount';
import {
  types as paymentTypes,
  statusesLabels,
  methodsLabels,
  typesLabels,
  typesProps,
  statusesColor,
  statuses as paymentsStatuses,
} from '../../../../../constants/payment';
import { shortify } from '../../../../../utils/uuid';
import StatusHistory from '../../../../../components/TransactionStatusHistory';
import { targetTypes } from '../../../../../constants/note';
import PopoverButton from '../../../../../components/PopoverButton';
import TransactionGridFilter from './TransactionGridFilter';
import PaymentDetailModal from './PaymentDetailModal';
import PaymentActionReasonModal from './PaymentActionReasonModal';
import PaymentAddModal from './PaymentAddModal';
import { UncontrolledTooltip } from '../../../../../components/Reactstrap/Uncontrolled';
import PropTypes from '../../../../../constants/propTypes';
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
    isLoading: PropTypes.bool.isRequired,
    fetchEntities: PropTypes.func.isRequired,
    loadPaymentStatuses: PropTypes.func.isRequired,
    onChangePaymentStatus: PropTypes.func.isRequired,
    loadPaymentMethods: PropTypes.func.isRequired,
    addPayment: PropTypes.func.isRequired,
    manageNote: PropTypes.func.isRequired,
    resetNote: PropTypes.func.isRequired,
    entities: PropTypes.object,
    currencyCode: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    newPaymentNote: PropTypes.noteEntity,
    profile: PropTypes.object,
    accumulatedBalances: PropTypes.object,
    paymentActionReasons: PropTypes.paymentActionReasons,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
    refreshPinnedNotes: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
    page: 0,
    modal: defaultModalState,
  };

  componentWillMount() {
    this.handleRefresh();
  }

  componentDidMount() {
    this.context.setNoteChangedCallback(this.handleRefresh);
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
  }

  handleNoteClick = (target, data) => {
    if (data.note) {
      this.context.onEditNoteClick(target, data.note, { placement: 'left' });
    } else {
      this.context.onAddNoteClick(data.paymentId, targetTypes.PAYMENT)(target, { placement: 'left' });
    }
  };

  handlePageChanged = (page) => {
    if (!this.props.isLoading) {
      this.setState({ page: page - 1 }, this.handleRefresh);
    }
  };

  handleRefresh = () => this.props.fetchEntities(
    this.props.params.id, {
      ...this.state.filters,
      page: this.state.page,
    },
  );

  handleFilterSubmit = (data = {}) => {
    const filters = { ...data };

    if (filters.states) {
      filters.states = [filters.states];
    }

    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleChangePaymentStatus = (action, playerUUID, paymentId, options = {}) => {
    const { onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({ action, playerUUID, paymentId, options })
      .then(this.handleRefresh)
      .then(this.handleCloseModal);
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
    this.setState({
      modal: {
        name: MODAL_PAYMENT_ADD,
      },
    });
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
    const action = await this.props.loadPaymentStatuses(params.payment.playerUUID, params.payment.paymentId);

    this.setState({
      modal: {
        ...defaultModalState,
        name: MODAL_PAYMENT_DETAIL,
        params: {
          ...params,
          transactions: action && !action.error
            ? action.payload
            : [],
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
            profile: this.props.profile,
            accumulatedBalances: this.props.accumulatedBalances,
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
  }

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
        {shortify(data.paymentAccount, null, 2)}
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
      onLoad={() => this.props.loadPaymentStatuses(data.playerUUID, data.paymentId)}
      label={
        <div>
          <div className={classNames(statusesColor[data.status], 'font-weight-700')}>
            {statusesLabels[data.status] || data.status}
          </div>
          {
            data.creatorUUID &&
            <div className="font-size-10 color-default">
              {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={data.creatorUUID} length={20} />
            </div>
          }
          <span className="font-size-10 color-default">
            {I18n.t('COMMON.DATE_ON', {
              date: moment(data.creationTime).format('DD.MM.YYYY - HH:mm:ss'),
            })}
          </span>
        </div>
      }
    />
  );

  renderActions = (data) => {
    return (
      <PopoverButton
        id={`bonus-item-note-button-${data.paymentId}`}
        className="cursor-pointer margin-right-5"
        onClick={id => this.handleNoteClick(id, data)}
      >
        {data.note
          ? (data.note.pinned ? <i className="note-icon note-pinned-note" /> :
          <i className="note-icon note-with-text" />)
        : <i className="note-icon note-add-note" />
        }
      </PopoverButton>
    );
  };

  render() {
    const { modal } = this.state;
    const {
      entities,
      currencyCode,
      loadPaymentMethods,
      manageNote,
      profile: { fullName, shortUUID },
      params: { id: playerUUID },
      newPaymentNote,
    } = this.props;

    return (
      <div className="tab-pane fade in active profile-tab-container">
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

        <TransactionGridFilter
          currencyCode={currencyCode}
          onSubmit={this.handleFilterSubmit}
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
            playerInfo={{
              currencyCode,
              fullName,
              shortUUID,
            }}
            onClose={this.handleCloseModal}
            onLoadPaymentMethods={() => loadPaymentMethods(playerUUID)}
            onSubmit={this.handleAddPayment}
            onManageNote={manageNote}
          />
        }
      </div>
    );
  }
}

export default View;
