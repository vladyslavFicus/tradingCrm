import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import ShortLoader from '../../../../../components/ShortLoader';
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
    modals: PropTypes.shape({
      paymentDetail: PropTypes.modalType,
    }).isRequired,
    fetchPlayerMiniProfile: PropTypes.func.isRequired,
    loadPaymentStatuses: PropTypes.func.isRequired,
  };

  render() {
    const {
      clientPayments,
      auth,
      fetchPlayerMiniProfile,
      loadPaymentStatuses,
      modals,
    } = this.props;

    const payments = get(clientPayments, 'clientPayments.content', []);

    return (
      <div className="card card-body">
        <Choose>
          <When condition={clientPayments.loading}>
            <ShortLoader />
          </When>
          <Otherwise>
            <GridView
              dataSource={payments}
              showNoResults={payments.length === 0}
              tableClassName="table-hovered"
            >
              {columns({
                auth,
                modals,
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
          </Otherwise>
        </Choose>
      </div>
    );
  }
}

export default PaymentsGrid;
