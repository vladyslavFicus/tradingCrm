import React, { Component, Fragment } from 'react';
import { SubmissionError } from 'redux-form';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import TabHeader from 'components/TabHeader';
import { targetTypes } from 'constants/note';
import PaymentFilterFields from 'components/PaymentFilterFields';
import Grid, { GridColumn } from 'components/Grid';
import { columns } from 'utils/paymentHelpers';
import { CONDITIONS } from 'utils/permissions';

class Payments extends Component {
  static propTypes = {
    ...PropTypes.router,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    addPayment: PropTypes.func.isRequired,
    clientPayments: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      loadMore: PropTypes.func.isRequired,
      clientPaymentsByUuid: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentEntity),
        error: PropTypes.object,
      }),
    }).isRequired,
    newProfile: PropTypes.newProfile,
    modals: PropTypes.shape({
      addPayment: PropTypes.modalType,
    }).isRequired,
    addNote: PropTypes.func.isRequired,
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

  static defaultProps = {
    newProfile: {},
  }

  getChildContext() {
    return {
      getApolloRequestState: this.handleGetRequestState,
    };
  }

  async componentDidMount() {
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

  handleRefresh = () => this.props.clientPayments.refetch();

  handleGetRequestState = () => this.props.clientPayments.loading;

  handlePageChanged = () => {
    const {
      clientPayments: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleAddPayment = async (data) => {
    const { note, ...inputParams } = data;

    const {
      addPayment,
      addNote,
      match: { params: { id: uuid } },
      clientPayments,
      newProfile,
      modals: { addPayment: modal },
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
        clientPayments.refetch(),
        newProfile.refetch(),
      ]);

      modal.hide();
    }
  };

  handleOpenAddPaymentModal = () => {
    const {
      newProfile: { newProfile: { data } },
      modals: { addPayment } } = this.props;

    addPayment.show({
      onSubmit: this.handleAddPayment,
      newProfile: data,
    });
  };

  handleModalActionSuccess = () => this.props.clientPayments.refetch();

  handleSort = (sortData) => {
    const { history } = this.props;
    const query = get(history, 'location.query') || {};

    const sorts = Object.keys(sortData)
      .filter(sortingKey => sortData[sortingKey])
      .map(sortingKey => ({
        column: sortingKey,
        direction: sortData[sortingKey],
      }));

    history.replace({
      query: {
        ...query,
        sorts,
      },
    });
  };

  render() {
    const {
      clientPayments: {
        loading,
        clientPaymentsByUuid,
        variables,
      },
    } = this.props;

    const payments = get(clientPaymentsByUuid, 'data') || { content: [] };
    const error = get(clientPaymentsByUuid, 'error');

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
            <button type="button" className="btn btn-sm btn-primary-outline" onClick={this.handleOpenAddPaymentModal}>
              {I18n.t('PLAYER_PROFILE.TRANSACTIONS.ADD_TRANSACTION')}
            </button>
          </PermissionContent>
        </TabHeader>

        <PaymentFilterFields accountType={variables.accountType} isClientView />

        <div className="tab-wrapper">
          <Grid
            data={payments.content}
            handleSort={this.handleSort}
            handlePageChanged={this.handlePageChanged}
            isLoading={loading}
            isLastPage={payments.last}
            withLazyLoad
            withNoResults={!!error || (!loading && payments.content.length === 0)}
          >
            {columns({
              paymentInfo: { onSuccess: this.handleModalActionSuccess },
              clientView: true,
            }).map(({ name, header, sortBy, render }) => (
              <GridColumn
                key={name}
                name={name}
                sortBy={sortBy}
                header={header}
                render={render}
              />
            ))}
          </Grid>
        </div>
      </Fragment>
    );
  }
}

export default Payments;
