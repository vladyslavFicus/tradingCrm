import React, { Component } from 'react';
import Sticky from 'react-stickynode';
import SubTabNavigation from '../../../../../components/SubTabNavigation';

class TransactionsLayout extends Component {
  render() {
    const { children, subTabRoutes } = this.props;

    return (
      <div>
        <Sticky top=".panel-heading-row" bottomBoundary={0} innerZ="2">
          <div className="tab-header">
            <SubTabNavigation links={subTabRoutes} />
            <div className="tab-header__actions">
              ACTION
              {/*<button className="btn btn-sm btn-primary-outline" onClick={this.handleOpenAddPaymentModal}>
                + Add transaction
              </button>*/}
            </div>
          </div>
        </Sticky>
        {children}
      </div>
    );
  }
}

export default TransactionsLayout;
