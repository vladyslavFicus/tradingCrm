import React, { Component, Fragment } from 'react';
import { SubmissionError } from 'redux-form';
import { get, flatten } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import GridView, { GridViewColumn } from 'components/GridView';
import TabHeader from 'components/TabHeader';
import { targetTypes } from 'constants/note';
import { statusMapper } from 'constants/payment';
import history from 'router/history';
import { columns, filterFields } from 'utils/paymentHelpers';
import ListFilterForm from 'components/ListFilterForm';
import { CONDITIONS } from 'utils/permissions';

class Payments extends Component {
  static propTypes = {
    filters: PropTypes.shape({
      data: PropTypes.shape({
        paymentMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
        statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    }).isRequired,
    fetchProfile: PropTypes.func.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    resetAll: PropTypes.func.isRequired,
    auth: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    playerProfile: PropTypes.shape({
      playerProfile: PropTypes.shape({
        data: PropTypes.userProfile.isRequired,
      }),
      refetch: PropTypes.func.isRequired,
    }),
    locale: PropTypes.string.isRequired,
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
    operators: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentOriginalAgent),
        error: PropTypes.object,
      }),
    }).isRequired,
    modals: PropTypes.shape({
      addPayment: PropTypes.modalType,
    }).isRequired,
    addNote: PropTypes.func.isRequired,
  };

  static defaultProps = {
    playerProfile: null,
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onAddNote: PropTypes.func.isRequired,
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

  async componentDidMount() {
    const {
      context: {
        registerUpdateCacheListener,
        setNoteChangedCallback,
      },
      constructor: { name },
      handleRefresh,
      props: {
        match: { params: { id: playerUUID } },
        fetchFilters,
      },
    } = this;

    handleRefresh();
    registerUpdateCacheListener(name, handleRefresh);
    fetchFilters(playerUUID);
    setNoteChangedCallback(handleRefresh);
  }

  componentWillUnmount() {
    const {
      context: {
        unRegisterUpdateCacheListener,
        setNoteChangedCallback,
      },
      constructor: { name },
      props: { resetAll },
    } = this;

    resetAll();
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

  handleFiltersChanged = (data = {}) => {
    let statuses = null;

    if (Array.isArray(data.statuses)) {
      statuses = flatten(data.statuses.map(item => statusMapper[item]));
    }

    history.replace({
      query: {
        filters: {
          ...data,
          ...statuses && { statuses },
        },
      },
    });
  };

  handleFilterReset = () => {
    this.props.resetAll();
    history.replace({});
  };

  handleAddPayment = async (data) => {
    const { note, ...inputParams } = data;

    const {
      addPayment,
      addNote,
      match: { params: { id: uuid } },
      clientPayments: { refetch },
      playerProfile: { playerProfile },
      fetchProfile,
      modals: { addPayment: modal },
    } = this.props;

    const {
      country,
      languageCode: language,
      firstName,
      lastName,
    } = playerProfile.data;

    const variables = {
      ...inputParams,
      language,
      playerProfile: {
        country,
        firstName,
        lastName,
        uuid,
      },
    };
    const { data: { payment: { createClientPayment: { data: payment, error } } } } = await addPayment({ variables });

    if (error) {
      throw new SubmissionError({ _error: [error] });
    } else {
      if (note) {
        await addNote({ variables: { ...note, targetUUID: payment.paymentId } });
      }

      await Promise.all([
        refetch(),
        fetchProfile(uuid),
      ]);

      modal.hide();
    }
  };

  handleOpenAddPaymentModal = () => {
    const {
      modals: { addPayment },
      playerProfile: { playerProfile: { data }, refetch },
    } = this.props;

    refetch();

    addPayment.show({
      onSubmit: this.handleAddPayment,
      playerProfile: data,
    });
  };

  handleModalActionSuccess = () => this.props.clientPayments.refetch();

  render() {
    const {
      locale,
      clientPayments: {
        loading,
        clientPaymentsByUuid,
      },
      auth,
      operators: {
        operators,
        loading: operatorsLoading,
      },
    } = this.props;

    const entities = get(clientPaymentsByUuid, 'data') || { content: [] };
    const error = get(clientPaymentsByUuid, 'error');

    const originalAgents = get(operators, 'data.content') || [];
    const disabledOriginalAgentField = get(operators, 'error') || operatorsLoading;

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
        <ListFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          fields={filterFields(
            {
              originalAgents,
              disabledOriginalAgentField,
            },
            true,
          )}
        />

        <div className="tab-wrapper">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            last={entities.last}
            lazyLoad
            locale={locale}
            showNoResults={!!error || (!loading && entities.content.length === 0)}
            loading={loading}
          >
            {columns({
              paymentInfo: { onSuccess: this.handleModalActionSuccess },
              playerInfo: { auth },
              clientView: true,
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
      </Fragment>
    );
  }
}

export default Payments;
