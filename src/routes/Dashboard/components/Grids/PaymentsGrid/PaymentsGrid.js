import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import Grid, { GridColumn } from 'components/Grid';
import { columns } from 'utils/paymentHelpers';

class PaymentsGrid extends PureComponent {
  static propTypes = {
    clientPayments: PropTypes.shape({
      clientPayments: PropTypes.object,
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleModalActionSuccess = () => this.props.clientPayments.refetch();

  render() {
    const {
      clientPayments,
      clientPayments: { loading },
    } = this.props;

    const payments = get(clientPayments, 'clientPayments.data.content', []);
    const error = get(clientPayments, 'clientPayments.error.content');

    return (
      <div className="card card-body">
        <Grid
          data={payments}
          isLoading={loading}
          withRowsHover
          withNoResults={!!error || (!loading && payments.length === 0)}
        >
          {columns({
            paymentInfo: { onSuccess: this.handleModalActionSuccess },
          }).map(({ name, header, render }) => (
            <GridColumn
              key={name}
              name={name}
              header={header}
              render={render}
            />
          ))}
        </Grid>
      </div>
    );
  }
}

export default PaymentsGrid;
