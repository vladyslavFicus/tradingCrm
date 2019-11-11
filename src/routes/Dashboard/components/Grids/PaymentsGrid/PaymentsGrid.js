import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import GridView, { GridViewColumn } from 'components/GridView';
import { columns } from 'utils/paymentHelpers';

class PaymentsGrid extends PureComponent {
  static propTypes = {
    clientPayments: PropTypes.shape({
      clientPayments: PropTypes.object,
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    auth: PropTypes.shape({
      brandId: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
    }).isRequired,
    fetchPlayerMiniProfile: PropTypes.func.isRequired,
  };

  handleModalActionSuccess = () => this.props.clientPayments.refetch();

  render() {
    const {
      clientPayments,
      clientPayments: { loading },
      auth,
      fetchPlayerMiniProfile,
    } = this.props;

    const payments = get(clientPayments, 'clientPayments.data.content', []);
    const error = get(clientPayments, 'clientPayments.error.content');

    return (
      <div className="card card-body">
        <GridView
          loading={loading}
          dataSource={payments}
          showNoResults={error || (!loading && payments.length === 0)}
          tableClassName="table-hovered"
        >
          {columns({
            paymentInfo: { onSuccess: this.handleModalActionSuccess },
            playerInfo: { auth, fetchPlayer: fetchPlayerMiniProfile },
          }).map(({ name, header, render }) => (
            <GridViewColumn
              key={name}
              name={name}
              header={header}
              render={render}
            />
          ))}
        </GridView>
      </div>
    );
  }
}

export default PaymentsGrid;
