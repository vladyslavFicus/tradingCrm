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
    const { loadTransactions, params } = this.props;

    if (!this.props.transactions.isLoading) {
      loadTransactions(page, params.id);
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
    const { transactions, loadTransactions, params } = this.props;

    if (!transactions.isLoading) {
      loadTransactions(0, params.id);
    }
  }

  renderPagination(page, isLoading) {
    return <div className="row">
      <div className="col-sm-12">
        <div className="btn-group pull-right">
          <a href="#"
             className={classNames('btn btn-primary', { disabled: page === 0 || isLoading })}
             onClick={this.onNavigatePrev}>
            <Translate value="FRONTEND.PAGE_PREV_BUTTON"/>
          </a>

          <a href="#"
             className={classNames('btn btn-primary', { disabled: isLoading || !data.hasNext })}
             onClick={this.onNavigateNext}>
            <Translate value="FRONTEND.PAGE_NEXT_BUTTON"/>
          </a>
        </div>
      </div>
    </div>;
  }

  render() {
    const { transactions } = this.props;
    const { data, page, isLoading } = transactions;

    return <div id={`tab-${config.tabName}`} className={classNames('tab-pane fade in active')}>
      <table className="table table-striped table-responsive">
        <thead>
        <tr>
          <th>#</th>
          <th>Time</th>
          <th>Description</th>
          <th>Amount</th>
        </tr>
        </thead>
        <tbody>
        {data.items.map((item) => <tr key={item.id}>
          <td>{item.id}</td>
          <td>
            {item.transactionTime}
          </td>
          <td>{item.transactionName}</td>
          <td>${item.amount}</td>
        </tr>)}
        </tbody>
      </table>
    </div>;
  }
}

export default View;
