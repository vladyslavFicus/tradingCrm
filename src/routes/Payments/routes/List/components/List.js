import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import GridView, { GridColumn } from 'components/GridView';
import { TextFilter, DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';
import { statuses, statusesLabels, methodsLabels, typesLabels } from 'constants/payment';
import PaymentDetailModal from '../../../components/PaymentDetailModal';
import moment from 'moment';
import Amount from 'components/Amount';

const defaultFilters = {
  status: statuses.PENDING,
};
const defaultModalState = {
  name: null,
  params: {},
};

class List extends Component {
  state = { modal: { ...defaultModalState } };

  handlePageChanged = (page, filters) => {
    if (!this.props.list.isLoading) {
      this.props.fetchEntities({ ...filters, page: page - 1 });
    }
  };

  handleFiltersChanged = (filters) => {
    this.props.fetchEntities({ ...filters, page: 0 });
  };

  handleChangePaymentStatus = (status, paymentId, options = {}) => {
    const { list: { filters }, fetchEntities, onChangePaymentStatus } = this.props;

    return onChangePaymentStatus({ status, paymentId, options })
      .then(() => fetchEntities(filters))
      .then(() => this.handleCloseModal());
  };

  handleOpenModal = (e, name, params) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.loadPaymentTransactions(params.payment.paymentId)
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

  componentWillMount() {
    this.handleFiltersChanged({ ...defaultFilters });
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
    const { list: { entities } } = this.props;
    const { modal } = this.state;

    return <div className="page-content-inner">
      <Panel withBorders>
        <Title>
          <h3>Payments</h3>
        </Title>

        <Content>
          <GridView
            dataSource={entities.content}
            onFiltersChanged={this.handleFiltersChanged}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            defaultFilters={{ ...defaultFilters }}
            rowClassName={(data) => data.amountBarrierReached ? 'highlighted-row' : ''}
          >
            <GridColumn
              name="paymentId"
              header="ID"
              headerStyle={{ width: '20%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
            />
            <GridColumn
              name="paymentType"
              header="Payment type"
              headerClassName="text-center"
              headerStyle={{ width: '10%' }}
              className="text-center"
              filter={(onFilterChange) => <DropDownFilter
                name="type"
                items={{
                  '': 'All',
                  ...typesLabels,
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
                defaultValue={defaultFilters.status}
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
              name="playerUUID"
              header="Player UUID"
              headerStyle={{ width: '20%' }}
              render={(data, column) => <small>{data[column.name]}</small>}
              filter={(onFilterChange) => <TextFilter
                name="playerUUID"
                onFilterChange={onFilterChange}
              />}
            />
            <GridColumn
              name="actions"
              header="Actions"
              headerClassName="text-center"
              className="text-center"
              render={this.renderActions}
            />
          </GridView>
        </Content>

        {modal.name === 'payment-detail' && <PaymentDetailModal
          { ...modal.params }
          isOpen
          onClose={this.handleCloseModal}
          onChangePaymentStatus={this.handleChangePaymentStatus}
        />}
      </Panel>
    </div>;
  }
}

export default List;
