import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import classNames from 'classnames';
import moment from 'moment';
import Amount from 'components/Amount';
import { types, statusesLabels, methodsLabels, typesLabels, typesProps, statusesColor } from 'constants/payment';
import { shortify } from 'utils/uuid';
import StatusHistory from './StatusHistory';
import { targetTypes } from 'constants/note';
import NoteButton from "../../../components/NoteButton";

class View extends Component {
  state = {
    statusHistory: []
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.context.setNoteChangedCallback(this.handleFiltersChanged.bind(this, { playerUUID: this.props.params.id }));
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

  handlePageChanged = (page, filters) => {
    if (!this.props.isLoading) {
      this.props.fetchEntities({ ...filters, page: page - 1 });
    }
  };

  handleFiltersChanged = (filters) => {
    return this.props.fetchEntities({ ...filters, page: 0 });
  };

  handleChangePaymentStatus = (status, paymentId, options = {}) => {
    const { filters, fetchEntities, onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({ status, paymentId, options })
      .then(() => fetchEntities(filters))
      .then(() => this.handleCloseModal());
  };

  handleLoadStatusHistory = (paymentId) => () => {
    this.props.loadPaymentTransactions(paymentId)
      .then(action => {
        if (action && !action.error) {
          this.setState({
            statusHistory: action.payload,
          });
        }
      });
  };

  componentWillMount() {
    this.handleFiltersChanged({ playerUUID: this.props.params.id });
  }

  renderStatus = (data) => {
    return (
      <StatusHistory
        onLoad={this.handleLoadStatusHistory(data.paymentId)}
        label={
          <strong
            className={statusesColor[data.status]}>
            {statusesLabels[data.status] || data.status}
          </strong>
        }
        statusHistory={this.state.statusHistory}
      />
    );
  };

  renderTransactionId(data) {
    return (
      <span>
        <b>{shortify(data.paymentId, 'TA')}</b>
        <br />
        <span className="font-size-10 text-uppercase color-default">
          by {shortify(data.playerUUID, 'PL')}
        </span>
      </span>
    );
  }

  renderType(data) {
    const label = typesLabels[data.paymentType] || data.paymentType;
    const props = typesProps[data.paymentType] || {};

    return <b {...props}>{label}</b>;
  }

  renderAmount(data) {
    return (
      <strong
        className={classNames('', { 'color-danger': data.paymentType === types.Withdraw })}
      >
        {data.paymentType === types.Withdraw && '-'}<Amount { ...data.amount } />
      </strong>
    );
  }

  renderDateTime(data) {
    return (
      <div>
        <b>{moment(data.creationTime).format('DD.MM.YYYY')}</b>
        <br />
        <span className="font-size-10 color-default">
          {moment(data.creationTime).format('HH:mm')}
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
        <b> {methodsLabels[data.paymentMethod] || data.paymentMethod } </b> <br />
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
    ></i>;
  }

  render() {
    const { entities, params } = this.props;

    return <div className='tab-pane fade in active'>
      <GridView
        tableClassName="table table-hovered"
        headerClassName=""
        dataSource={entities.content}
        onFiltersChanged={this.handleFiltersChanged}
        onPageChange={this.handlePageChanged}
        activePage={entities.number + 1}
        totalPages={entities.totalPages}
        defaultFilters={{ playerUUID: params.id }}
        rowClassName={(data) => data.amountBarrierReached ? 'highlighted-row' : ''}
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
    </div>;
  }

  renderActions = (data) => {
    return <div>
      <NoteButton
        id={`bonus-item-note-button-${data.bonusUUID}`}
        className="cursor-pointer"
        onClick={(id) => this.handleNoteClick(id, data)}
      >
        {data.note
          ? <i className="fa fa-sticky-note"/>
          : <i className="fa fa-sticky-note-o"/>
        }
      </NoteButton>
    </div>;
  };
}

export default View;
