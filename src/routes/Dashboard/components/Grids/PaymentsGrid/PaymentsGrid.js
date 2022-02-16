import React, { PureComponent } from 'react';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import PaymentsListGrid from 'components/PaymentsListGrid';
import PaymentsQuery from './graphql/PaymentsQuery';

class PaymentsGrid extends PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    connectionKey: PropTypes.string, // Need to use for Apollo Cache to store results in different fields for same query
    paymentsQuery: PropTypes.shape({
      payments: PropTypes.object,
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    connectionKey: null,
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
