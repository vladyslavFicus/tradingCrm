import React, { Component } from 'react';
import classNames from 'classnames';
import { stopEvent } from 'utils/helpers';

const config = { tabName: 'transactions' };

class View extends Component {
  constructor(props) {
    super(props);

    this.onNavigatePrev = this.onNavigatePrev.bind(this);
    this.onNavigateNext = this.onNavigateNext.bind(this);
    this.goToPage = this.goToPage.bind(this);
  }

  goToPage(page) {
    if (!this.props.transactions.isLoading) {
      this.props.loadTransactions(page);
    }
  }

  onNavigatePrev(e) {
    stopEvent(e);

    const { transactions } = this.props;

    if (transactions.page > 0) {
      this.goToPage(transactions.page - 1);
    }
  }

  onNavigateNext(e) {
    stopEvent(e);

    const { transactions } = this.props;

    if (transactions.page >= 0) {
      this.goToPage(transactions.page + 1);
    }
  }

  componentWillMount() {
    const { transactions, loadTransactions } = this.props;

    if (!transactions.isLoading) {
      loadTransactions();
    }
  }

  render() {
    const { transactions } = this.props;
    const { data, page, isLoading } = transactions;

    return <div id={`tab-${config.tabName}`} className={classNames('tab-pane fade in active')}>
      <h5>Transactions details</h5>
      <table className="table table-striped table-responsive">
        <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Type</th>
          <th>Amount</th>
        </tr>
        </thead>
        <tbody>
        {data.items.map((item) => <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.description}</td>
          <td>{item.type}</td>
          <td>${item.amount}</td>
        </tr>)}
        </tbody>
      </table>
      <div className="row">
        <div className="col-sm-12">
          <div className="btn-group pull-right">
            <a href="#"
               className={classNames('btn btn-primary', { disabled: page === 0 || isLoading })}
               onClick={this.onNavigatePrev}>
              Prev
            </a>

            <a href="#"
               className={classNames('btn btn-primary', { disabled: isLoading || !data.hasNext })}
               onClick={this.onNavigateNext}>
              Next
            </a>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default View;
