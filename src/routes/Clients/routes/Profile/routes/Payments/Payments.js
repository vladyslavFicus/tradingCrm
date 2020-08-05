import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import PaymentsListFilters from 'components/PaymentsListFilters';
import PaymentsListGrid from 'components/PaymentsListGrid';
import TabHeader from 'components/TabHeader';
import PermissionContent from 'components/PermissionContent';
import { CONDITIONS } from 'utils/permissions';
import EventEmitter, { PROFILE_RELOAD } from 'utils/EventEmitter';
import PaymentAddModal from './components/PaymentAddModal';
import {
  PaymentsQuery,
  ProfileQuery,
} from './graphql';

class Payments extends PureComponent {
  static propTypes = {
    paymentsQuery: PropTypes.query({
      clientPayments: PropTypes.pageable(PropTypes.paymentEntity),
    }).isRequired,
    profileQuery: PropTypes.query({
      profile: PropTypes.profile,
    }).isRequired,
    modals: PropTypes.shape({
      addPaymentModal: PropTypes.modalType,
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.handleRefresh);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.handleRefresh);
  }

  handleRefresh = () => this.props.paymentsQuery.refetch();

  refetchQueries = () => {
    const {
      paymentsQuery,
      profileQuery,
    } = this.props;

    paymentsQuery.refetch();
    profileQuery.refetch();
  };

  handleOpenAddPaymentModal = () => {
    const {
      profileQuery,
      modals: { addPaymentModal },
    } = this.props;

    addPaymentModal.show({
      onSuccess: this.refetchQueries,
      profile: get(profileQuery, 'data.profile') || {},
    });
  };

  render() {
    const {
      paymentsQuery,
      paymentsQuery: {
        data,
        loading,
      },
    } = this.props;

    const clientPaymentsQuery = {
      ...paymentsQuery,
      data: {
        payments: get(data, 'clientPayments') || { content: [] },
      },
    };

    return (
      <Fragment>
        <TabHeader title={I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.PAYMENTS')}>
          <PermissionContent
            permissions={[
              permissions.PAYMENT.DEPOSIT,
              permissions.PAYMENT.WITHDRAW,
              permissions.PAYMENT.CREDIT_IN,
              permissions.PAYMENT.CREDIT_OUT,
              permissions.PAYMENT.TRANSFER,
            ]}
            permissionsCondition={CONDITIONS.OR}
          >
            <Button
              onClick={this.handleOpenAddPaymentModal}
              primaryOutline
              small
            >
              {I18n.t('PLAYER_PROFILE.TRANSACTIONS.ADD_TRANSACTION')}
            </Button>
          </PermissionContent>
        </TabHeader>
        <PaymentsListFilters
          paymentsLoading={loading}
          clientView
        />
        <PaymentsListGrid
          paymentsQuery={clientPaymentsQuery}
          handleRefresh={this.handleRefresh}
          clientView
        />
      </Fragment>
    );
  }
}

export default compose(
  withModals({
    addPaymentModal: PaymentAddModal,
  }),
  withRequests({
    paymentsQuery: PaymentsQuery,
    profileQuery: ProfileQuery,
  }),
)(Payments);
