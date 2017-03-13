import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import classNames from 'classnames';
import moment from 'moment';
import Amount from 'components/Amount';
import {
  types as paymentTypes,
  statusesLabels,
  methodsLabels,
  typesLabels,
  typesProps,
  statusesColor,
  statuses as paymentsStatuses,
} from 'constants/payment';
import { shortify } from 'utils/uuid';
import StatusHistory from './StatusHistory';
import { targetTypes } from 'constants/note';
import NoteButton from "../../../components/NoteButton";
import TransactionGridFilter from './TransactionGridFilter';
import PaymentDetailModal from 'routes/Payments/components/PaymentDetailModal';
import PaymentRejectModal from 'routes/Payments/components/PaymentRejectModal';

const defaultModalState = {
  name: null,
  params: {},
};

class View extends Component {
  state = {
    filters: {},
    page: 0,
    modal: defaultModalState,
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.context.setNoteChangedCallback(this.handleRefresh);
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
  }

  getNotePopoverParams = () => ({
    placement: 'left'
  });

  handleNoteClick = (target, data) => {
    if (data.note) {
      this.context.onEditNoteClick(target, data.note, this.getNotePopoverParams());
    } else {
      this.context.onAddNoteClick(data.paymentId, targetTypes.PAYMENT)(target, this.getNotePopoverParams());
    }
  };

  handlePageChanged = (page) => {
    if (!this.props.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleRefresh = () => {
    return this.props.fetchEntities({
      ...this.state.filters,
      page: this.state.page,
      playerUUID: this.props.params.id,
    });
  };

  componentWillMount() {
    this.handleRefresh();
  }

  handleFilterSubmit = (filters) => {
    if (filters.states) {
      filters.states = [filters.states];
    }

    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  handleChangePaymentStatus = (status, paymentId, options = {}) => {
    const { filters, fetchEntities, onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({ status, paymentId, options })
      .then(() => fetchEntities(filters))
      .then(() => this.handleCloseModal());
  };

  handleAboutToReject = (e, payment) => {
    this.handleCloseModal();

    this.handleOpenModal(e, 'payment-about-to-reject', {
      payment,
      profile: this.props.profile,
      accumulatedBalances: this.props.accumulatedBalances,
      rejectReasons: this.props.paymentRejectReasons
    });
};

  handleOpenModal = (e, name, params) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.loadPaymentStatuses(params.payment.paymentId)
      .then(action => {
        if (action && !action.error) {
          params.transactions = action.payload;
        }

        this.setState({ modal: { ...defaultModalState, name, params } });
      });
  };

  handleCloseModal = (e, callback) => {
    this.setState({ modal: { ...defaultModalState } }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  handleLoadStatusHistory = paymentId => () => {
    return this.props.loadPaymentStatuses(paymentId);
  };

  renderTransactionId(data) {
    return (
      <span>
        <div className="font-weight-700">{shortify(data.paymentId, 'TA')}</div>
        <span className="font-size-10 text-uppercase color-default">
          by {shortify(data.playerUUID, 'PL')}
        </span>
      </span>
    );
  }

  renderType(data) {
    const label = typesLabels[data.paymentType] || data.paymentType;
    const props = typesProps[data.paymentType] || {};

    return (
      <div>
        <div { ...props }> {label} </div>
        <span className="font-size-10 text-uppercase color-default">
          {data.paymentSystemRefs.map((SystemRef, index) => (
            <div key={`${SystemRef}-${index}`} children={SystemRef} />
          ))}
        </span>
      </div>
    );
  }

  renderAmount(data) {
    return <div className={classNames('font-weight-700', { 'color-danger': data.paymentType === paymentTypes.Withdraw })}>
      {data.paymentType === paymentTypes.Withdraw && '-'}<Amount { ...data.amount } />
    </div>;
  }

  renderDateTime(data) {
    return (
      <div>
        <div className="font-weight-700">
          {moment(data.creationTime).format('DD.MM.YYYY')}
        </div>
        <span className="font-size-10 color-default">
          {moment(data.creationTime).format('HH:mm:ss')}
        </span>
      </div>
    );
  }

  renderIP(data) {
    if (!data.country) {
      return data.country;
    }

    return <i className={`fs-icon fs-${data.country.toLowerCase()}`}/>;
  }

  renderMethod(data) {
    return (
      <div>
        <div className="font-weight-700">
          {methodsLabels[data.paymentMethod] || data.paymentMethod }
        </div>
        <span className="font-size-10">
          { shortify(data.paymentAccount, null, 2) }
        </span>
      </div>
    );
  }

  renderDevice(data) {
    return <i
      className={`fa font-size-20 ${data.mobile ? 'fa-mobile' : 'fa-desktop'}`}
      aria-hidden="true"
    />;
  }

  renderStatus = (data) => {
    return (
      <StatusHistory
        onLoad={this.handleLoadStatusHistory(data.paymentId)}
        label={
          <div>
            <div className={classNames(statusesColor[data.status], 'font-weight-700')}>
              {statusesLabels[data.status] || data.status}
            </div>
            <span className="font-size-10 color-default">
              {moment(data.creationTime).format('DD.MM.YYYY \- HH:mm:ss')}
            </span>
          </div>
        }
      />
    );
  };

  render() {
    const { filters, modal } = this.state;
    const { entities, currencyCode } = this.props;

    return <div className='tab-pane fade in active profile-tab-container'>
      <TransactionGridFilter
        currencyCode={currencyCode}
        onSubmit={this.handleFilterSubmit}
        initialValues={filters}
      />

      <GridView
        tableClassName="table table-hovered profile-table"
        headerClassName=""
        dataSource={entities.content}
        onPageChange={this.handlePageChanged}
        activePage={entities.number + 1}
        totalPages={entities.totalPages}
        rowClassName={(data) => data.amountBarrierReached ? 'highlighted-row' : ''}
        lazyLoad
      >
        <GridColumn
          name="paymentId"
          header="Transaction"
          headerClassName='text-uppercase'
          render={this.renderTransactionId}
        />
        <GridColumn
          name="paymentType"
          header="Type"
          headerClassName='text-uppercase'
          render={this.renderType}
        />
        <GridColumn
          name="amount"
          header="Amount"
          headerClassName='text-uppercase'
          render={this.renderAmount}
        />
        <GridColumn
          name="creationTime"
          header="DATE & TIME"
          headerClassName='text-uppercase'
          render={this.renderDateTime}
        />
        <GridColumn
          name="country"
          header="Ip"
          headerClassName='text-uppercase text-center'
          render={this.renderIP}
        />
        <GridColumn
          name="paymentMethod"
          header="Method"
          headerClassName='text-uppercase'
          render={this.renderMethod}
        />
        <GridColumn
          name="mobile"
          header="Device"
          headerClassName='text-uppercase text-center'
          className='text-center'
          render={this.renderDevice}
        />
        <GridColumn
          name="status"
          header="Status"
          headerClassName='text-uppercase'
          className='text-uppercase'
          render={this.renderStatus}
        />
        <GridColumn
          name="actions"
          header={""}
          render={this.renderActions}
        />
      </GridView>

      {modal.name === 'payment-detail' && <PaymentDetailModal
        { ...modal.params }
        isOpen
        onClose={this.handleCloseModal}
        onChangePaymentStatus={this.handleChangePaymentStatus}
        onAboutToReject={this.handleAboutToReject}
      />}

      {modal.name === 'payment-about-to-reject' && <PaymentRejectModal
        { ...modal.params }
        isOpen
        onClose={this.handleCloseModal}
        onChangePaymentStatus={this.handleChangePaymentStatus}
      />}

    </div>;
  }

  renderActions = data => {
    return <div>
      <NoteButton
        id={`bonus-item-note-button-${data.paymentId}`}
        className="cursor-pointer margin-right-5"
        onClick={(id) => this.handleNoteClick(id, data)}
      >
        {data.note
          ? <i className="fa fa-sticky-note"/>
          : <i className="fa fa-sticky-note-o"/>
        }
      </NoteButton>
      {
        data.paymentType === paymentTypes.Withdraw && data.status === paymentsStatuses.PENDING &&
        <a href="#" onClick={(e) => this.handleOpenModal(e, 'payment-detail', {
          payment: data,
          profile: this.props.profile,
          accumulatedBalances: this.props.accumulatedBalances,
        })} title={'View payment'}>
          <i className="fa fa-search"/>
        </a>
      }
    </div>;
  };
}

export default View;
