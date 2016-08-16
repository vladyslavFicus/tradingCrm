import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionCreators as transactionsListActionCreators } from '../modules/transactions-list';
import Table from './Table';

class List extends Component {
  componentWillMount() {
    this.props.loadTransactions();
  }

  render() {
    const { transactions } = this.props;

    return <div className="page-content-inner">
      <section className="panel panel-with-borders">
        <div className="panel-heading">
          <h3>Transactions</h3>
        </div>

        <div className="panel-body">
          <div className="row">
            <div className="col-lg-12">
              <Table isLoading={transactions.isLoading} items={transactions.data.items}/>
            </div>
          </div>
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
