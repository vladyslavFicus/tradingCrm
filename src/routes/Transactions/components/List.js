import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionCreators as transactionsListActionCreators } from '../modules/transactions-list';
import Table from './Table';
import { Pagination } from 'react-bootstrap';

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        playerUUID: '',
        paymentType: '',
        startDate: '',
        endDate: '',
      },
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handlePlayerUuidChange = this.handlePlayerUuidChange.bind(this);
    this.handlePaymentTypeChange = this.handlePaymentTypeChange.bind(this);
    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.onFiltersChanged = this.onFiltersChanged.bind(this);
  }

  handleSelect(eventKey) {
    const { transactions, loadTransactions } = this.props;

    if (!transactions.isLoading) {
      loadTransactions(eventKey - 1, this.state.filters);
    }
  }

  handlePaymentTypeChange(e) {
    const target = e.target;

    this.setState({ filters: { ...this.state.filters, paymentType: target.value } }, this.onFiltersChanged);
  }

  handleDatesChange({ startDate, endDate }) {
    if (startDate && endDate) {
      this.setState({
        filters: {
          ...this.state.filters,
          startDate: startDate.format('YYYY/MM/DD'),
          endDate: endDate.format('YYYY/MM/DD'),
        },
      }, this.onFiltersChanged);
    }
  }

  handlePlayerUuidChange(e) {
    const target = e.target;

    this.setState({ filters: { ...this.state.filters, playerUUID: target.value } }, this.onFiltersChanged);
  }

  onFiltersChanged() {
    this.props.loadTransactions(0, this.state.filters);
  }

  componentWillMount() {
    const { transactions, loadTransactions } = this.props;

    if (!transactions.isLoading) {
      loadTransactions(0, this.state.filters);
    }
  }

  render() {
    const { transactions: data } = this.props;
    const { transactions, isLoading } = data;

    return <div className="page-content-inner">
      <section className="panel panel-with-borders">
        <div className="panel-heading">
          <h3>Transactions</h3>
        </div>

        <div className="panel-body">
          <div className="row">
            <div className="col-lg-12">
              <Table
                handlePlayerUuidChange={this.handlePlayerUuidChange}
                handlePaymentTypeChange={this.handlePaymentTypeChange}
                handleDatesChange={this.handleDatesChange}
                isLoading={isLoading}
                items={transactions.content}
              />
            </div>
          </div>

          {transactions.totalPages > 1 && <div className="row">
            <div className="col-lg-12">
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                items={transactions.totalPages}
                maxButtons={5}
                activePage={transactions.number + 1}
                onSelect={this.handleSelect}/>
            </div>
          </div>}
        </div>
      </section>
    </div>;
  }
}

const mapStateToProps = (state) => ({ transactions: { ...state.transactionsList } });
const mapActions = {
  ...transactionsListActionCreators,
};

export default connect(mapStateToProps, mapActions)(List);
