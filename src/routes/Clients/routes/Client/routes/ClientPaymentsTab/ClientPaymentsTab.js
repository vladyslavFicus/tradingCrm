import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import AddPaymentModal from 'modals/AddPaymentModal';
import { Button } from 'components/UI';
import PaymentsListFilters from 'components/PaymentsListFilters';
import PaymentsListGrid from 'components/PaymentsListGrid';
import TabHeader from 'components/TabHeader';
import PermissionContent from 'components/PermissionContent';
import { CONDITIONS } from 'utils/permissions';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import {
  PaymentsQuery,
  ProfileQuery,
} from './graphql';
import './ClientPaymentsTab.scss';

class ClientPaymentsTab extends PureComponent {
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
    EventEmitter.on(CLIENT_RELOAD, this.handleRefresh);
  }

  componentWillUnmount() {
    EventEmitter.off(CLIENT_RELOAD, this.handleRefresh);
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
      profileQuery: { data },
      modals: { addPaymentModal },
    } = this.props;

    addPaymentModal.show({
      onSuccess: this.refetchQueries,
      profile: data?.profile || {},
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
        payments: data?.clientPayments || { content: [] },
      },
    };

    return (
      <div className="ClientPaymentsTab">
        <TabHeader
          title={I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.PAYMENTS')}
          className="ClientPaymentsTab__header"
        >
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
              commonOutline
              small
            >
              {I18n.t('PLAYER_PROFILE.TRANSACTIONS.ADD_TRANSACTION')}
            </Button>
          </PermissionContent>
        </TabHeader>

        <PaymentsListFilters
          handleRefetch={this.handleRefresh}
          paymentsLoading={loading}
          clientView
        />

        <PaymentsListGrid
          paymentsQuery={clientPaymentsQuery}
          handleRefresh={this.handleRefresh}
          headerStickyFromTop={189}
          clientView
        />
      </div>
    );
  }
}

export default compose(
  withModals({
    addPaymentModal: AddPaymentModal,
  }),
  withRequests({
    paymentsQuery: PaymentsQuery,
    profileQuery: ProfileQuery,
  }),
)(ClientPaymentsTab);
