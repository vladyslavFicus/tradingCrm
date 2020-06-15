import React, { PureComponent } from 'react';
import { get } from 'lodash';
// import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import PaymentsListGrid from 'components/PaymentsListGrid';
import PaymentsQuery from './graphql/PaymentsQuery';

class PaymentsGrid extends PureComponent {
  static propTypes = {
    paymentsQuery: PropTypes.query({
      clientPayments: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentEntity),
      }),
    }).isRequired,
  };

  handleModalActionSuccess = () => this.props.paymentsQuery.refetch();

  render() {
    const {
      paymentsQuery,
    } = this.props;

    const payments = get(paymentsQuery, 'data.clientPayments') || {};

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
