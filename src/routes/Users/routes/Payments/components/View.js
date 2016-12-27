import React, { Component } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import { DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';
import classNames from 'classnames';
import moment from 'moment';
import Amount from 'components/Amount';
import { statusesLabels, methodsLabels } from 'constants/payment';
import PaymentDetailModal from 'routes/Payments/components/PaymentDetailModal';

const defaultModalState = {
  name: null,
  params: {},
};
class View extends Component {
  state = { modal: { ...defaultModalState } };

  handlePageChanged = (page, filters) => {
    if (!this.props.isLoading) {
      this.props.fetchEntities({ ...filters, page: page - 1 });
    }
  };

  handleFiltersChanged = (filters) => {
    return this.props.fetchEntities({ ...filters, page: 0 });
  };

  handleChangePaymentStatus = (status, paymentId) => {
    const { filters, fetchEntities, onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({ status, paymentId })
      .then(() => fetchEntities(filters))
      .then(() => this.handleCloseModal());
  };

  handleOpenModal = (e, name, params) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ modal: { ...defaultModalState, name, params } })
  };

  handleCloseModal = (e, callback) => {
    this.setState({ modal: { ...defaultModalState } }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  componentWillMount() {
    this.handleFiltersChanged({ playerUUID: this.props.params.id });
  }

  renderStatus(data, column) {
    return statusesLabels[data[column.name]] || data[column.name];
  }

  renderMethod(data, column) {
    return methodsLabels[data[column.name]] || data[column.name];
  }

  renderAmount(data, column) {
    return <Amount currency={data.currency} amount={data[column.name]}/>;
  }

  renderActions = (data) => {
    return <div>
      <a href="#" onClick={(e) => this.handleOpenModal(e, 'payment-detail', { payment: data })} title={'View payment'}>
        <i className="fa fa-search"/>
      </a>
    </div>;
  };

  render() {
    const { entities, params } = this.props;
    const { modal } = this.state;

    return <div className={classNames('tab-pane fade in active')}>
      <GridView
        dataSource={entities.content}
        onFiltersChanged={this.handleFiltersChanged}
        onPageChange={this.handlePageChanged}
        activePage={entities.number + 1}
        totalPages={entities.totalPages}
        defaultFilters={{ playerUUID: params.id }}
      >
        <GridColumn
          name="paymentId"
          header="ID"
          headerStyle={{ width: '20%' }}
          render={(data, column) => <small>{data[column.name]}</small>}
        />
        <GridColumn
          name="discriminator"
          header="Payment type"
          headerClassName="text-center"
          headerStyle={{ width: '10%' }}
          className="text-center"
          filter={(onFilterChange) => <DropDownFilter
            name="type"
            items={{
              '': 'All',
              ...methodsLabels,
            }}
            onFilterChange={onFilterChange}
          />}
        />
        <GridColumn
          name="status"
          header="Status"
          headerClassName="text-center"
          render={this.renderStatus}
          filter={(onFilterChange) => <DropDownFilter
            name="status"
            items={{
              '': 'All',
              ...statusesLabels,
            }}
            onFilterChange={onFilterChange}
          />}
          className="text-center"
        />
        <GridColumn
          name="paymentMethod"
          header="Payment method"
          headerClassName="text-center"
          render={this.renderMethod}
          className="text-center"
        />
        <GridColumn
          name="amount"
          header="Amount"
          headerClassName="text-center"
          headerStyle={{ width: '10%' }}
          render={this.renderAmount}
          className="text-center"
        />
        <GridColumn
          name="creationTime"
          header="Time"
          headerClassName="text-center"
          headerStyle={{ width: '20%' }}
          render={(data, column) => moment(data[column.name]).format('DD.MM.YYYY HH:mm:ss')}
          filter={(onFilterChange) => <DateRangeFilter
            isOutsideRange={(date) => moment() <= date}
            onFilterChange={onFilterChange}
          />}
          filterClassName="text-center"
          className="text-center"
        />
        <GridColumn
          name="actions"
          header="Actions"
          headerClassName="text-center"
          className="text-center"
          render={this.renderActions}
        />
      </GridView>

      {modal.name === 'payment-detail' && <PaymentDetailModal
        { ...modal.params }
        isOpen
        onClose={this.handleCloseModal}
        onChangePaymentStatus={this.handleChangePaymentStatus}
      />}
    </div>;
  }
}

export default View;
