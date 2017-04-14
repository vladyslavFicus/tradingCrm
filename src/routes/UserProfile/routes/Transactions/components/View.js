import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';
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
import NoteButton from '../../../../../components/NoteButton';
import TransactionGridFilter from './TransactionGridFilter';
import PaymentDetailModal from './PaymentDetailModal';
import PaymentRejectModal from './PaymentRejectModal';
import { UncontrolledTooltip } from '../../../../../components/Reactstrap/Uncontrolled';

const MODAL_PAYMENT_DETAIL = 'payment-detail';
const MODAL_PAYMENT_REJECT = 'payment-reject';
const MODAL_PAYMENT_ADD = 'payment-add';
const defaultModalState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    fetchEntities: PropTypes.func.isRequired,
    loadPaymentStatuses: PropTypes.func.isRequired,
    onChangePaymentStatus: PropTypes.func.isRequired,
    entities: PropTypes.object,
    currencyCode: PropTypes.string,
    filters: PropTypes.object,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    profile: PropTypes.object,
    accumulatedBalances: PropTypes.object,
    paymentRejectReasons: PropTypes.array,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
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
    }
  );


  handleFilterSubmit = (data = {}) => {
    const filters = { ...data };

    if (filters.states) {
      filters.states = [filters.states];
    }

    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleChangePaymentStatus = (status, playerUUID, paymentId, options = {}) => {
    const { onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({ status, playerUUID, paymentId, options })
      .then(this.handleRefresh)
      .then(this.handleCloseModal);
  };

  handleRejectClick = (data) => {
    this.handleCloseModal();

    return this.handleOpenModal(MODAL_PAYMENT_REJECT, {
      ...data,
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

  handleCloseModal = (e, callback) => {
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
        <div {...props}> {label} </div>
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
        {methodsLabels[data.paymentMethod] || data.paymentMethod }
      </div>
      <span className="font-size-10">
        { shortify(data.paymentAccount, null, 2) }
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
        id={`bonus-item-note-button-${data.paymentId}`}
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
          onClick={() => this.handleOpenModal(MODAL_PAYMENT_DETAIL, {
            payment: data,
            profile: this.props.profile,
            accumulatedBalances: this.props.accumulatedBalances,
          })}
          title={'View payment'}
        >
          <i className="fa fa-search" />
        </button>
      }
    </div>
  );

  render() {
    const { modal } = this.state;
    const { entities, currencyCode } = this.props;

    return (
      <div className="tab-pane fade in active profile-tab-container">
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
            onRejectClick={this.handleRejectClick}
          />
        }

        {
          modal.name === MODAL_PAYMENT_REJECT &&
          <PaymentRejectModal
            {...modal.params}
            isOpen
            onClose={this.handleCloseModal}
            onChangePaymentStatus={this.handleChangePaymentStatus}
          />
        }
      </div>
    );
  }
}

export default View;
