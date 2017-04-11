import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import TransactionsFilterForm from './TransactionsFilterForm';
import PropTypes from '../../../../../constants/propTypes';
import Panel, { Title, Content } from '../../../../../components/Panel';
import GridView, { GridColumn } from '../../../../../components/GridView';
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
import PaymentDetailModal from '../../../components/PaymentDetailModal';
import PaymentRejectModal from '../../../components/PaymentRejectModal';
import StatusHistory from '../../../../../components/TransactionStatusHistory';
import { targetTypes } from '../../../../../constants/note';
import NoteButton from '../../../../../components/NoteButton';
import Amount from '../../../../../components/Amount';
import { UncontrolledTooltip } from '../../../../../components/Reactstrap/Uncontrolled';

const MODAL_PAYMENT_DETAIL = 'payment-detail';
const MODAL_PAYMENT_REJECT = 'payment-reject';
const defaultFilters = {
  status: paymentsStatuses.PENDING,
};
const defaultModalState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    transactions: PropTypes.pageableState(PropTypes.paymentEntity).isRequired,
    fetchEntities: PropTypes.func.isRequired,
    loadPaymentStatuses: PropTypes.func.isRequired,
    onChangePaymentStatus: PropTypes.func.isRequired,
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
    filters: { ...defaultFilters },
    page: 0,
    modal: { ...defaultModalState },
  };

  componentWillMount() {
    this.handleRefresh();
  }

  componentDidMount() {
    this.context.notes.setNoteChangedCallback(this.handleRefresh);
  }

  componentWillUnmount() {
    this.context.notes.setNoteChangedCallback(null);
  }

  handleNoteClick = (target, data) => {
    if (data.note) {
      this.context.notes.onEditNoteClick(target, data.note, { placement: 'left' });
    } else {
      this.context.notes.onAddNoteClick(
        target,
        { playerUUID: data.playerUUID, targetUUID: data.paymentId, targetType: targetTypes.PAYMENT },
        { placement: 'left' }
      );
    }
  };

  handleRefresh = () => this.props.fetchEntities({
    ...this.state.filters,
    page: this.state.page,
  });

  handlePageChanged = (page) => {
    if (!this.props.transactions.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleFiltersChanged = (data = {}) => {
    const filters = { ...data };

    if (filters.states) {
      filters.states = [filters.states];
    }

    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleChangePaymentStatus = (status, paymentId, options = {}) => {
    const { onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({ status, paymentId, options })
      .then(this.handleRefresh)
      .then(this.handleCloseModal);
  };

  handleAboutToReject = (payment) => {
    this.handleCloseModal();

    this.handleOpenModal(MODAL_PAYMENT_REJECT, {
      payment,
      profile: this.props.profile,
      accumulatedBalances: this.props.accumulatedBalances,
      rejectReasons: this.props.paymentRejectReasons,
    });
  };

  handleOpenModal = async (name, params) => {
    const action = await this.props.loadPaymentStatuses(params.payment.playerUUID, params.payment.paymentId);

    this.setState({
      modal: {
        ...defaultModalState,
        name,
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

  renderTransactionId = data => (
    <span>
      <div className="font-weight-700">{shortify(data.paymentId, 'TA')}</div>
      <span className="font-size-10 text-uppercase color-default">
          by {shortify(data.playerUUID, 'PL')}
      </span>
    </span>
  );

  renderType = (data) => {
    const label = typesLabels[data.paymentType] || data.paymentType;
    const props = typesProps[data.paymentType] || {};

    return (
      <div>
        <div {...props}>{label}</div>
        <span className="font-size-10 text-uppercase color-default">
          {data.paymentSystemRefs.map((SystemRef, index) => (
            <div key={`${SystemRef}-${index}`} children={SystemRef} />
          ))}
        </span>
      </div>
    );
  };

  renderAmount = data => (
    <div className={classNames('font-weight-700', { 'color-danger': data.paymentType === paymentTypes.Withdraw })}>
      {data.paymentType === paymentTypes.Withdraw && '-'}<Amount {...data.amount} />
    </div>
  );

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

    return <i className={`fs-icon fs-${data.country.toLowerCase()}`} />;
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
          aria-hidden="true"
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
          <span className="font-size-10 color-default">
            {moment(data.creationTime).format('DD.MM.YYYY - HH:mm:ss')}
          </span>
        </div>
      }
    />
  );

  renderActions = data => (
    <div>
      <NoteButton
        id={`transaction-item-note-button-${data.paymentId}`}
        className="cursor-pointer margin-right-5"
        onClick={id => this.handleNoteClick(id, data)}
      >
        {data.note
          ? <i className="fa fa-sticky-note" />
          : <i className="fa fa-sticky-note-o" />
        }
      </NoteButton>
      {
        data.paymentType === paymentTypes.Withdraw && data.status === paymentsStatuses.PENDING &&
        <button
          className="btn-transparent"
          onClick={() => this.handleOpenModal('payment-detail', {
            payment: data,
            profile: this.props.profile,
            accumulatedBalances: this.props.accumulatedBalances,
          })} title={'View payment'}
        >
          <i className="fa fa-search" />
        </button>
      }
    </div>
  );

  render() {
    const { transactions: { entities } } = this.props;
    const { modal } = this.state;

    return (
      <div className="page-content-inner">
        <Panel withBorders>
          <div className="row margin-bottom-20">
            <div className="col-md-3">
              <Title>
                <h3>Transactions</h3>
              </Title>
            </div>
          </div>

          <Content>
            <TransactionsFilterForm
              onSubmit={this.handleFiltersChanged}
              initialValues={defaultFilters}
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
                onClose={() => this.handleCloseModal()}
                onChangePaymentStatus={this.handleChangePaymentStatus}
                onAboutToReject={this.handleAboutToReject}
              />
            }

            {
              modal.name === MODAL_PAYMENT_REJECT &&
              <PaymentRejectModal
                {...modal.params}
                isOpen
                onClose={() => this.handleCloseModal()}
                onChangePaymentStatus={this.handleChangePaymentStatus}
              />
            }
          </Content>
        </Panel>
      </div>
    );
  }
}

export default View;
