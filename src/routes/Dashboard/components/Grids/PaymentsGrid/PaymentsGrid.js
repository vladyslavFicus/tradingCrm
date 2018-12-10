import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import columns from './utils';

class PaymentsGrid extends PureComponent {
  static propTypes = {
    clientPayments: PropTypes.shape({
      clientPayments: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    auth: PropTypes.shape({
      brandId: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
    }).isRequired,
    fetchPlayerMiniProfile: PropTypes.func.isRequired,
    loadPaymentStatuses: PropTypes.func.isRequired,
  };

  render() {
    const {
      clientPayments,
      clientPayments: { loading },
      auth,
      fetchPlayerMiniProfile,
      loadPaymentStatuses,
    } = this.props;

    const payments = get(clientPayments, 'clientPayments.content', []);

    return (
      <div className="card card-body">
        <GridView
          loading={loading}
          dataSource={payments}
          showNoResults={payments.length === 0}
          tableClassName="table-hovered"
        >
          {columns({
            auth,
            fetchPlayerMiniProfile,
            loadPaymentStatuses,
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
