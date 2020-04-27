import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { SubmissionError } from 'redux-form'; // TODO
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import { Button } from 'components/UI';
import PaymentsListFilters from 'components/PaymentsListFilters';
import PaymentsListGrid from 'components/PaymentsListGrid';
import TabHeader from 'components/TabHeader';
import PermissionContent from 'components/PermissionContent';
import { CONDITIONS } from 'utils/permissions';
import PaymentAddModal from './components/PaymentAddModal';
import {
  PaymentsQuery,
  ProfileQuery,
  AddPayment,
  AddNote,
} from './graphql';

class Payments extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    paymentsQuery: PropTypes.query({
      clientPaymentsByUuid: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentEntity),
      }),
    }).isRequired,
    profileQuery: PropTypes.query({
      newProfile: PropTypes.shape({
        data: PropTypes.newProfile,
      }),
    }).isRequired,
    addPayment: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      addPaymentModal: PropTypes.modalType,
    }).isRequired,
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    getApolloRequestState: PropTypes.func.isRequired,
  };

  getChildContext() {
    return {
      getApolloRequestState: this.handleGetRequestState,
    };
  }

  componentDidMount() {
    const {
      context: {
        registerUpdateCacheListener,
        setNoteChangedCallback,
      },
      constructor: { name },
      handleRefresh,
    } = this;

    handleRefresh();
    registerUpdateCacheListener(name, handleRefresh);
    setNoteChangedCallback(handleRefresh);
  }

  componentWillUnmount() {
    const {
      context: {
        unRegisterUpdateCacheListener,
        setNoteChangedCallback,
      },
      constructor: { name },
    } = this;

    setNoteChangedCallback(null);
    unRegisterUpdateCacheListener(name);
  }

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.onEditNoteClick(target, note, { placement: 'left' });
    } else {
      this.context.onAddNoteClick(data.paymentId, targetTypes.PAYMENT)(target, {
        placement: 'left',
        id: data.paymentId,
      });
    }
  };

  handleRefresh = () => this.props.paymentsQuery.refetch();

  handleGetRequestState = () => this.props.paymentsQuery.loading;

  handleAddPayment = async (data) => {
    const { note, ...inputParams } = data;

    const {
      addPayment,
      addNote,
      match: { params: { id: uuid } },
      paymentsQuery,
      profileQuery,
      modals: { addPaymentModal },
    } = this.props;

    const variables = {
      ...inputParams,
      profileUUID: uuid,
    };

    const { data: { payment: { createClientPayment: { data: payment, error } } } } = await addPayment({ variables });

    if (error) {
      throw new SubmissionError({ _error: [error] });
    } else {
      if (note) {
        await addNote({ variables: { ...note, targetUUID: payment.paymentId } });
      }

      await Promise.all([
        paymentsQuery.refetch(),
        profileQuery.refetch(),
      ]);

      addPaymentModal.hide();
    }
  };

  handleOpenAddPaymentModal = () => {
    const {
      profileQuery,
      modals: { addPaymentModal },
    } = this.props;

    addPaymentModal.show({
      onSubmit: this.handleAddPayment,
      newProfile: get(profileQuery, 'data.newProfile.data'),
    });
  };

  render() {
    const {
      paymentsQuery,
      paymentsQuery: {
        data, loading,
      },
    } = this.props;

    const payments = get(data, 'clientPaymentsByUuid') || {};

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
          payments={payments}
          paymentsQuery={paymentsQuery}
          handleRefresh={this.handleRefresh}
          clientView
        />
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  withModals({
    addPaymentModal: PaymentAddModal,
  }),
  withRequests({
    paymentsQuery: PaymentsQuery,
    profileQuery: ProfileQuery,
    addPayment: AddPayment,
    addNote: AddNote,
  }),
)(Payments);
