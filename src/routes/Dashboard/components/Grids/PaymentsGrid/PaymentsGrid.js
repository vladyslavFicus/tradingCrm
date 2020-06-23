import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import PaymentsListGrid from 'components/PaymentsListGrid';
import PaymentsQuery from './graphql/PaymentsQuery';

class PaymentsGrid extends PureComponent {
  static propTypes = {
    paymentsQuery: PropTypes.shape({
      payments: PropTypes.object,
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleModalActionSuccess = () => this.props.paymentsQuery.refetch();

  render() {
    const { paymentsQuery } = this.props;

    const payments = get(paymentsQuery, 'data.payments', []);

    return (
      <PaymentsListGrid
        payments={payments}
        paymentsQuery={paymentsQuery}
        handleRefresh={this.handleModalActionSuccess}
        withLazyLoad={false}
      />
    );
  }
}

export default withRequests({
  paymentsQuery: PaymentsQuery,
})(PaymentsGrid);
