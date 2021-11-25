import React, { PureComponent } from 'react';
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

    return (
      <PaymentsListGrid
        paymentsQuery={paymentsQuery}
        handleRefresh={this.handleModalActionSuccess}
        withSort={false}
        withLazyload={false}
      />
    );
  }
}

export default withRequests({
  paymentsQuery: PaymentsQuery,
})(PaymentsGrid);
